"""
Thorough address fix using official business registries + website scraping.
  - Norway:  Brreg API (data.brreg.no)
  - Sweden:  Company website contact pages
  - Denmark: CVR/Virk API (cvrapi.dk)
  - Finland: Company website contact pages

Outputs geocode_registry_results.json with verified addresses + coords.
Run this script, review the output, then run apply_geocode_results.py to update companies.ts.
"""
import re, sys, time, json, urllib.request, urllib.parse, os, html

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE = os.path.join(os.path.dirname(__file__), '..')
OUT  = os.path.join(os.path.dirname(__file__), 'geocode_registry_results.json')

HEADERS_HTML = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120',
    'Accept': 'text/html,application/xhtml+xml,*/*',
    'Accept-Language': 'en-US,en;q=0.9,no;q=0.8',
}
HEADERS_JSON = {
    'User-Agent': 'kapitalkart-geocoder/1.0 (research/educational project)',
    'Accept': 'application/json',
}

# ─────────────────────────────────────────────────────────────────────────────
# Registry lookups
# ─────────────────────────────────────────────────────────────────────────────

def brreg_lookup(name):
    """Search Norwegian Brønnøysund registry for a company name.
    Returns (street, postalCode, city) or None."""
    query = urllib.parse.quote(name)
    url = f'https://data.brreg.no/enhetsregisteret/api/enheter?navn={query}&size=5'
    try:
        req = urllib.request.Request(url, headers=HEADERS_JSON)
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read())
        hits = data.get('_embedded', {}).get('enheter', [])
        for hit in hits:
            addr = hit.get('forretningsadresse') or hit.get('postadresse') or {}
            streets = addr.get('adresse', [])
            postal  = addr.get('postnummer', '')
            city    = addr.get('poststed', '')
            if streets and city:
                return streets[0], postal, city.title()
    except Exception as e:
        pass
    return None

def cvr_lookup(name):
    """Search Danish CVR registry. Returns (street, postalCode, city) or None."""
    query = urllib.parse.quote(name)
    url = f'https://cvrapi.dk/api?search={query}&country=dk'
    try:
        req = urllib.request.Request(url, headers={**HEADERS_JSON, 'User-Agent': 'kapitalkart-geocoder/1.0'})
        with urllib.request.urlopen(req, timeout=10) as r:
            data = json.loads(r.read())
        if isinstance(data, list):
            data = data[0] if data else {}
        street  = data.get('address', '')
        zipcode = data.get('zipcode', '')
        city    = data.get('city', '')
        if street and city:
            return street, zipcode, city
    except:
        pass
    return None

def nominatim_geocode(query):
    """Geocode via Nominatim. Returns (lat, lng) or (None, None)."""
    params = urllib.parse.urlencode({'q': query, 'format': 'json', 'limit': 1})
    url = f'https://nominatim.openstreetmap.org/search?{params}'
    try:
        req = urllib.request.Request(url, headers=HEADERS_JSON)
        with urllib.request.urlopen(req, timeout=10) as r:
            results = json.loads(r.read())
        if results:
            return float(results[0]['lat']), float(results[0]['lon'])
    except:
        pass
    return None, None

# ─────────────────────────────────────────────────────────────────────────────
# Website scraping for address
# ─────────────────────────────────────────────────────────────────────────────

def fetch_html(url, timeout=12):
    try:
        req = urllib.request.Request(url, headers=HEADERS_HTML)
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.read(100_000).decode('utf-8', errors='replace')
    except:
        return ''

def extract_address_from_html(text):
    """Try to extract a street address from HTML content."""
    # Remove tags
    clean = re.sub(r'<[^>]+>', ' ', text)
    clean = html.unescape(clean)

    # Norwegian/Swedish/Danish patterns
    # "Streetname 12, 0161 Oslo" or "Streetname 12\n0161 Oslo"
    patterns = [
        # "Street N, DDDD City"
        r'([A-ZÆØÅÄÖ][a-zæøåäöA-ZÆØÅÄÖ\s\'\.]{3,40}\s+\d{1,4}[A-Za-z]?)[,\s]+(\d{4,5})\s+([A-ZÆØÅÄÖA-Za-zæøåäö][a-zæøåäö\s]{2,20})',
        # "Street N\nDDDD City" (newline separated)
        r'([A-ZÆØÅÄÖ][a-zæøåäöA-ZÆØÅÄÖ\s\'\.]{3,40}\s+\d{1,4}[A-Za-z]?)\s*\n\s*(\d{4,5})\s+([A-Za-zæøåäöÆØÅÄÖ][a-zæøåäö\s]{2,20})',
    ]
    for pat in patterns:
        m = re.search(pat, clean)
        if m:
            street = m.group(1).strip()
            city   = m.group(3).strip()
            # Sanity: skip obviously wrong matches
            if len(street) > 60 or len(city) > 30: continue
            if any(w in street.lower() for w in ['phone', 'mail', 'email', 'tel', 'fax', 'org', 'http']): continue
            return street, city
    return None, None

def scrape_contact_page(website, cid):
    """Try to find address by visiting /contact, /about, /om-oss etc."""
    slug_variants = ['contact', 'contact-us', 'om-oss', 'kontakt', 'about', 'about-us',
                     'contact/', 'kontakt/', 'om/', 'information', 'info']
    base = website.rstrip('/')

    for slug in slug_variants:
        url = f'{base}/{slug}'
        html_text = fetch_html(url)
        if not html_text:
            continue
        street, city = extract_address_from_html(html_text)
        if street and city:
            return street, city, url

    # Try main page too
    html_text = fetch_html(base)
    if html_text:
        street, city = extract_address_from_html(html_text)
        if street and city:
            return street, city, base

    return None, None, None

# ─────────────────────────────────────────────────────────────────────────────
# Parse companies.ts
# ─────────────────────────────────────────────────────────────────────────────

with open(os.path.join(BASE, 'src', 'data', 'companies.ts'), encoding='utf-8') as f:
    content = f.read()

blocks = re.split(r'(?=\{  id:)', content)
all_companies = []
for block in blocks:
    m_id      = re.search(r'id:\s*"([^"]+)"', block)
    m_name    = re.search(r'name:\s*"([^"]+)"', block)
    m_web     = re.search(r'website:\s*"([^"]+)"', block)
    m_city    = re.search(r'city:\s*"([^"]+)"', block)
    m_country = re.search(r'country:\s*"([^"]+)"', block)
    m_lat     = re.search(r'lat:\s*([\d.]+)', block)
    m_lng     = re.search(r'lng:\s*([\d.]+)', block)
    if not m_id: continue
    all_companies.append({
        'id':      m_id.group(1),
        'name':    m_name.group(1) if m_name else '',
        'website': m_web.group(1) if m_web else '',
        'city':    m_city.group(1) if m_city else '',
        'country': m_country.group(1) if m_country else '',
        'has_lat': bool(m_lat),
        'cur_lat': float(m_lat.group(1)) if m_lat else None,
        'cur_lng': float(m_lng.group(1)) if m_lng else None,
    })

# Only process companies missing coords
missing = [c for c in all_companies if not c['has_lat']]
print(f'Total companies: {len(all_companies)}, missing coords: {len(missing)}\n')

# Load existing results
results = {}
if os.path.exists(OUT):
    with open(OUT, encoding='utf-8') as f:
        results = json.load(f)

def save():
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(results, f, ensure_ascii=False, indent=2)

# ─────────────────────────────────────────────────────────────────────────────
# Process each missing company
# ─────────────────────────────────────────────────────────────────────────────

for i, c in enumerate(missing):
    cid     = c['id']
    name    = c['name']
    country = c['country']
    website = c['website']

    if cid in results and results[cid].get('lat'):
        print(f'[{i+1:2d}/{len(missing)}] CACHED  {name}')
        continue

    print(f'[{i+1:2d}/{len(missing)}] {name:45s} ({country})')
    address, city, lat, lng, source = None, c['city'], None, None, 'unknown'

    # ── 1. Try official registry ──
    if country == 'Norway':
        reg = brreg_lookup(name)
        if reg:
            address, _, city = reg
            print(f'    brreg → {address}, {city}')
            source = 'brreg'
        time.sleep(0.5)

    elif country == 'Denmark':
        reg = cvr_lookup(name)
        if reg:
            address, _, city = reg
            print(f'    cvr   → {address}, {city}')
            source = 'cvr'
        time.sleep(0.5)

    # ── 2. Scrape website for address ──
    if not address and website:
        street, scraped_city, page_url = scrape_contact_page(website, cid)
        if street:
            address = street
            if scraped_city:
                city = scraped_city
            print(f'    web   → {address}, {city}  ({page_url})')
            source = 'web'
        time.sleep(0.8)

    # ── 3. Geocode ──
    if address:
        query = f'{address}, {city}, {country}'
    else:
        query = f'{city}, {country}'
        source = 'city-center'
        print(f'    fallback city-center: {query}')

    lat, lng = nominatim_geocode(query)
    time.sleep(1.1)

    if lat:
        results[cid] = {
            'lat': round(lat, 4), 'lng': round(lng, 4),
            'address': address or city, 'city': city,
            'country': country, 'source': source,
        }
        print(f'    ✓ {lat:.4f}, {lng:.4f}')
    else:
        results[cid] = {'lat': None, 'lng': None, 'address': query, 'source': 'failed'}
        print(f'    ✗ geocode failed')

    save()

ok = sum(1 for v in results.values() if v.get('lat'))
print(f'\n── Done: {ok}/{len(results)} geocoded  ──')
print(f'Results: {OUT}')
