"""
Geocode company addresses using Nominatim (OpenStreetMap).
For well-known companies we use their actual registered office address.
For others we scrape their website's contact page for an address.
Run: python scripts/geocode.py
"""
import requests, time, json, re, sys
from urllib.parse import urlparse
from bs4 import BeautifulSoup

# Fix Windows cp1252 encoding issues when printing Unicode characters
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

HEADERS = {"User-Agent": "IBMap/1.0 educational project - github.com/egil10/ibmap"}

# ── Known/researched office addresses ──────────────────────────────────────────
# Sourced from company websites, Proff.no, and public records.
KNOWN = {
    # Oslo companies with precise addresses
    "nbim":              "Bankplassen 2, Oslo",
    "dnb-am":            "Dronning Eufemias gate 30, Oslo",
    "klp":               "Beddingen 8, Oslo",
    "storebrand-am":     "Lysaker Torg 35, Lysaker",
    "pareto-am":         "Dronning Mauds gate 3, Oslo",
    "arctic-am":         "Haakon VIIs gate 5, Oslo",
    "abg":               "Munkedamsveien 45, Oslo",
    "fondsfinans":       "Haakon VIIs gate 2, Oslo",
    "fsn-capital":       "Haakon VIIs gate 2, Oslo",
    "norvestor":         "Haakon VIIs gate 5, Oslo",
    "credo-partners":    "Haakon VIIs gate 5, Oslo",
    "kistefos":          "Stranden 1, Oslo",
    "ferd-capital":      "Strandveien 50, Lysaker",
    "norges-investor":   "Dronning Mauds gate 3, Oslo",
    "nbim":              "Bankplassen 2, Oslo",
    "norfund":           "Fridtjof Nansens plass 4, Oslo",
    "odin":              "Riddervolds plass 1, Oslo",
    "nordea-am":         "Essendrops gate 7, Oslo",
    "folketrygdfondet":  "Ruseløkkveien 19, Oslo",
    "alfred-berg":       "Munkedamsveien 45, Oslo",
    "cworldwide":        "Munkedamsveien 35, Oslo",
    "handelsbanken":     "Tjuvholmen allé 11, Oslo",
    "salt-capital":      "Dronning Mauds gate 3, Oslo",
    "sector-am":         "Torgallmenningen 1, Bergen",
    "holberg":           "Torgallmenningen 2, Bergen",
    "borea-am":          "Øvre Ole Bulls plass 5, Bergen",
    "argentum":          "Vaskerelven 45, Bergen",
    "jebsen-am":         "Strandkaien 2, Bergen",
    "hitecvision":       "Forusbeen 50, Stavanger",
    "ev-pe":             "Badehusgata 37, Stavanger",
    "equinor-am":        "Forusbeen 50, Stavanger",
    "antler":            "Filipstad Brygge 1, Oslo",
    "mckinsey-oslo":     "Filipstad Brygge 1, Oslo",
    "bcg-oslo":          "Munkedamsveien 45, Oslo",
    "bain-oslo":         "Drammensveien 134, Oslo",
    "summa-equity":      "Tjuvholmen allé 1, Oslo",
    "fsn-capital":       "Haakon VIIs gate 2, Oslo",
    "norvestor":         "Haakon VIIs gate 5, Oslo",
    "cubera":            "Drammensveien 126, Oslo",
    "svelland":          "Haakon VIIs gate 5, Oslo",
    "hartree":           "Filipstad Brygge 2, Oslo",
    "glencore":          "Filipstad Brygge 2, Oslo",
    "trafigura":         "Dronning Mauds gate 3, Oslo",
    "kraftfinans":       "Tungasletta 2, Trondheim",
    "investinor":        "Fjordgata 1, Trondheim",
    "ae-energi":         "Keiser Wilhelms gate 37, Alesund",
    "startuplab-fund":   "Gaustadalléen 21, Oslo",
    "statkraft-ventures":"Lilleakerveien 6, Oslo",
    "arendals-fossekompani": "Støperiveien 2, Arendal",
    "eqt":               "Biblioteksgatan 9, Stockholm",
    "nordic-capital":    "Regeringsgatan 38, Stockholm",
    "adrigo":            "Biblioteksgatan 9, Stockholm",
    "protean-funds":     "Norrmalmstorg 1, Stockholm",
}

def geocode_nominatim(address: str) -> tuple[float,float] | None:
    url = "https://nominatim.openstreetmap.org/search"
    for attempt in range(2):
        try:
            r = requests.get(url, params={"q": address, "format": "json", "limit": 1,
                                          "countrycodes": "no,se,dk,fi"},
                             headers=HEADERS, timeout=8)
            data = r.json()
            if data:
                return float(data[0]["lat"]), float(data[0]["lon"])
            # widen search without country filter
            r2 = requests.get(url, params={"q": address, "format": "json", "limit": 1},
                              headers=HEADERS, timeout=8)
            data2 = r2.json()
            if data2:
                return float(data2[0]["lat"]), float(data2[0]["lon"])
        except Exception as e:
            print(f"  [retry] {e}")
        time.sleep(1)
    return None

def scrape_address(website: str) -> str | None:
    """Try to find a Norwegian street address on the company's contact page."""
    CONTACT_PATHS = ["/contact", "/kontakt", "/om-oss", "/about", "/about-us", "/contact-us"]
    domain = urlparse(website).netloc
    for path in CONTACT_PATHS:
        try:
            url = f"https://{domain}{path}"
            r = requests.get(url, headers=HEADERS, timeout=6, allow_redirects=True)
            if r.status_code != 200:
                continue
            soup = BeautifulSoup(r.text, "html.parser")
            text = soup.get_text(" ", strip=True)
            # Norwegian address patterns: "Gatenavn 12, Oslo" or with zip "0123 Oslo"
            match = re.search(
                r'([A-ZÆØÅ][a-zæøå]+(?:\s[A-ZÆØÅ]?[a-zæøå]+)*\s\d+[A-Za-z]?)'
                r'(?:[,\s]+(?:\d{4}\s)?([A-ZÆØÅ][a-zæøå]+))',
                text
            )
            if match:
                return match.group(0).strip()
        except Exception:
            pass
        time.sleep(0.3)
    return None

# ── Load current company list ──────────────────────────────────────────────────
import sys, os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Parse companies from gen_data.py
import ast
with open("gen_data.py") as f:
    src = f.read()

# Extract companies_data list
match = re.search(r'companies_data = \[(.*?)\]', src, re.DOTALL)
raw = "[" + match.group(1) + "]"
companies_data = ast.literal_eval(raw)

print(f"Loaded {len(companies_data)} companies\n")

results = {}
for c in companies_data:
    id_, name, cat, web, city, country, lat, lng, *rest = c
    address = KNOWN.get(id_)
    source = "known"

    if not address:
        # Try scraping the contact page
        print(f"  Scraping {name}...")
        scraped = scrape_address(web)
        if scraped:
            address = scraped + f", {city}"
            source = "scraped"
        else:
            # Fall back to city-level
            address = f"{name}, {city}, {country}"
            source = "city-level"

    print(f"[{source:12s}] {name}: {address}")
    coord = geocode_nominatim(address)
    if coord:
        new_lat, new_lng = coord
        # Sanity check: result should be within ~200km of expected city
        lat_diff = abs(new_lat - lat)
        lng_diff = abs(new_lng - lng)
        if lat_diff < 3.0 and lng_diff < 5.0:
            results[id_] = (round(new_lat, 4), round(new_lng, 4), source)
            moved = "  MOVED" if (lat_diff > 0.001 or lng_diff > 0.001) else "  same"
            print(f"  {moved} ({lat},{lng}) -> ({new_lat:.4f},{new_lng:.4f})")
        else:
            results[id_] = (lat, lng, "unchanged-sanity")
            print(f"  SKIP geocoding result too far away, keeping original")
    else:
        results[id_] = (lat, lng, "unchanged-no-result")
        print(f"  FAIL geocoding failed, keeping original")
    time.sleep(1.1)   # Nominatim: max 1 req/sec

# Save results
with open("scripts/geocode_results.json", "w") as f:
    json.dump(results, f, indent=2)
print(f"\nSaved {len(results)} results to scripts/geocode_results.json")
