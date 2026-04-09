"""
Improved logo fetcher: gets icon logo + wide/og:image logo for each company.
- Icon  → public/logos/{id}.png        (small square, for map pins)
- Wide  → public/logos/{id}-wide.png   (wider branded logo, for cards)
"""
import re, os, sys, time, urllib.request, urllib.error, html

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

LOGOS_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'logos')
os.makedirs(LOGOS_DIR, exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120',
    'Accept': 'image/webp,image/png,image/*,*/*',
}

def get_domain(url):
    try:
        from urllib.parse import urlparse
        return urlparse(url).hostname.replace('www.', '')
    except:
        return ''

def fetch_bytes(url, timeout=10):
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.read()
    except:
        return None

def save(path, data):
    with open(path, 'wb') as f:
        f.write(data)

def is_valid_image(data, min_bytes=200):
    if not data or len(data) < min_bytes:
        return False
    # Check magic bytes
    if data[:8] == b'\x89PNG\r\n\x1a\n': return True  # PNG
    if data[:3] == b'GIF': return True                  # GIF
    if data[:2] in (b'\xff\xd8', b'BM'): return True   # JPEG, BMP
    if b'<svg' in data[:500].lower(): return True       # SVG
    if data[:4] == b'RIFF' or data[:4] == b'webp': return True
    return False

def get_og_image(website):
    """Scrape og:image from a website's homepage."""
    try:
        req = urllib.request.Request(website, headers={
            **HEADERS, 'Accept': 'text/html,application/xhtml+xml'
        })
        with urllib.request.urlopen(req, timeout=12) as r:
            raw = r.read(80000).decode('utf-8', errors='replace')

        # og:image
        m = re.search(r'<meta[^>]+(?:property=["\']og:image["\']|name=["\']og:image["\'])[^>]*content=["\']([^"\']+)["\']', raw, re.IGNORECASE)
        if not m:
            m = re.search(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]*property=["\']og:image["\']', raw, re.IGNORECASE)
        if m:
            url = html.unescape(m.group(1).strip())
            if url.startswith('//'):
                url = 'https:' + url
            elif url.startswith('/'):
                from urllib.parse import urlparse
                base = urlparse(website)
                url = f'{base.scheme}://{base.netloc}{url}'
            return url

        # twitter:image fallback
        m = re.search(r'<meta[^>]+(?:name=["\']twitter:image["\'])[^>]*content=["\']([^"\']+)["\']', raw, re.IGNORECASE)
        if m:
            url = html.unescape(m.group(1).strip())
            if url.startswith('//'):
                url = 'https:' + url
            return url
    except:
        pass
    return None

def fetch_icon(company_id, domain):
    """Try multiple sources for a square icon logo."""
    sources = [
        f'https://logo.clearbit.com/{domain}?size=200',
        f'https://www.google.com/s2/favicons?domain={domain}&sz=256',
        f'https://{domain}/favicon.ico',
        f'https://{domain}/apple-touch-icon.png',
        f'https://{domain}/favicon.png',
    ]
    for src in sources:
        data = fetch_bytes(src, timeout=8)
        if is_valid_image(data):
            return data
    return None

def fetch_wide(company_id, website, domain):
    """Try to get a wide/branded logo via og:image."""
    og_url = get_og_image(website)
    if og_url:
        data = fetch_bytes(og_url, timeout=10)
        if is_valid_image(data, min_bytes=1000):  # og images should be bigger
            return data
    return None

# ── Parse company list ──
with open(os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'companies.ts'), encoding='utf-8') as f:
    content = f.read()

pattern = r'id:\s*"([^"]+)".*?website:\s*"([^"]+)"'
companies = re.findall(pattern, content, re.DOTALL)
print(f'Found {len(companies)} companies')

results = {'icon_ok': 0, 'icon_skip': 0, 'icon_fail': 0, 'wide_ok': 0, 'wide_skip': 0, 'wide_fail': 0}

for i, (cid, website) in enumerate(companies):
    domain = get_domain(website)
    if not domain:
        continue

    icon_path = os.path.join(LOGOS_DIR, f'{cid}.png')
    wide_path = os.path.join(LOGOS_DIR, f'{cid}-wide.png')

    # ── Icon ──
    if os.path.exists(icon_path) and os.path.getsize(icon_path) > 200:
        results['icon_skip'] += 1
    else:
        data = fetch_icon(cid, domain)
        if data:
            save(icon_path, data)
            results['icon_ok'] += 1
            print(f'  [{i+1:3d}] icon  ✓  {cid}')
        else:
            results['icon_fail'] += 1
            print(f'  [{i+1:3d}] icon  ✗  {cid}  ({domain})')
        time.sleep(0.3)

    # ── Wide ──
    if os.path.exists(wide_path) and os.path.getsize(wide_path) > 1000:
        results['wide_skip'] += 1
    else:
        data = fetch_wide(cid, website, domain)
        if data:
            save(wide_path, data)
            results['wide_ok'] += 1
            print(f'  [{i+1:3d}] wide  ✓  {cid}')
        else:
            results['wide_fail'] += 1
        time.sleep(0.4)

print()
print('=== Results ===')
for k, v in results.items():
    print(f'  {k}: {v}')
