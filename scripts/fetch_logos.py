"""
Fetch company logos for IBMap.
Tries Clearbit first (full logos), then Google's favicon service (high-res).
Saves to public/logos/{company-id}.png
Run: python scripts/fetch_logos.py
"""
import requests, time, os, ast, re, sys
from urllib.parse import urlparse

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

HEADERS = {'User-Agent': 'Mozilla/5.0 IBMap/1.0 (github.com/egil10/ibmap)'}
OUT_DIR = 'public/logos'
os.makedirs(OUT_DIR, exist_ok=True)

def get_domain(url: str) -> str:
    try:
        return urlparse(url).netloc.replace('www.', '')
    except Exception:
        return ''

def try_download(url: str, min_size: int = 800) -> bytes | None:
    try:
        r = requests.get(url, headers=HEADERS, timeout=10, allow_redirects=True)
        if r.status_code == 200 and len(r.content) >= min_size:
            ct = r.headers.get('content-type', '')
            if 'image' in ct or 'octet' in ct:
                return r.content
            # Accept even without perfect content-type if we have enough bytes
            if len(r.content) >= 2000:
                return r.content
    except Exception:
        pass
    return None

# Load companies from gen_data.py
with open('gen_data.py', encoding='utf-8') as f:
    src = f.read()

match = re.search(r'companies_data = \[(.*?)\]', src, re.DOTALL)
companies = ast.literal_eval('[' + match.group(1) + ']')
print(f'Fetching logos for {len(companies)} companies...\n')

ok, google_ok, failed = 0, 0, 0

for company in companies:
    id_, name, cat, web = company[:4]
    domain = get_domain(web)
    outfile = os.path.join(OUT_DIR, f'{id_}.png')

    if os.path.exists(outfile):
        print(f'  [skip ] {id_}')
        continue

    if not domain:
        print(f'  [skip ] {id_} (no domain)')
        failed += 1
        continue

    # 1. Try Clearbit (full brand logos, best quality)
    data = try_download(f'https://logo.clearbit.com/{domain}', min_size=800)
    if data:
        with open(outfile, 'wb') as f:
            f.write(data)
        print(f'  [logo ] {id_}: {domain} ({len(data)//1024}KB)')
        ok += 1
        time.sleep(0.3)
        continue

    time.sleep(0.2)

    # 2. Try Google favicon at 256px
    data = try_download(f'https://www.google.com/s2/favicons?domain={domain}&sz=256', min_size=100)
    if data:
        with open(outfile, 'wb') as f:
            f.write(data)
        print(f'  [fav  ] {id_}: {domain} ({len(data)//1024}KB)')
        google_ok += 1
        time.sleep(0.15)
        continue

    # 3. Try direct favicon.ico on the domain
    data = try_download(f'https://{domain}/favicon.ico', min_size=100)
    if data:
        with open(outfile, 'wb') as f:
            f.write(data)
        print(f'  [ico  ] {id_}: {domain}')
        google_ok += 1
        time.sleep(0.15)
        continue

    print(f'  [FAIL ] {id_}: {domain}')
    failed += 1
    time.sleep(0.2)

print(f'\nDone: {ok} clearbit, {google_ok} favicon, {failed} failed')
print(f'Logos saved to {OUT_DIR}/')
