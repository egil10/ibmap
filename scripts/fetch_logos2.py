"""
Improved logo fetcher: gets icon logo + wide/og:image logo for each company.
- Icon  -> public/logos/{id}.png        (small square, for map pins)
- Wide  -> public/logos/{id}-wide.png   (wider branded logo, for cards)
"""

import html
import io
import os
import re
import sys
import time
import urllib.request
from urllib.parse import urljoin, urlparse

from PIL import Image

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

LOGOS_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'logos')
os.makedirs(LOGOS_DIR, exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120',
    'Accept': 'image/webp,image/png,image/*,*/*',
}


def get_domain(url):
    try:
        hostname = urlparse(url).hostname or ''
        return hostname.replace('www.', '')
    except Exception:
        return ''


def fetch_bytes(url, timeout=10, accept=None):
    try:
        headers = dict(HEADERS)
        if accept:
            headers['Accept'] = accept
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=timeout) as response:
            return response.read()
    except Exception:
        return None


def fetch_html(website):
    data = fetch_bytes(website, timeout=12, accept='text/html,application/xhtml+xml')
    if not data:
        return None
    return data.decode('utf-8', errors='replace')


def is_valid_image(data, min_bytes=200):
    if not data or len(data) < min_bytes:
        return False
    if data[:8] == b'\x89PNG\r\n\x1a\n':
        return True
    if data[:3] == b'GIF':
        return True
    if data[:2] in (b'\xff\xd8', b'BM'):
        return True
    if data[:4] == b'RIFF':
        return True
    if data[:4] == b'\x00\x00\x01\x00':
        return True
    return b'<svg' in data[:1000].lower()


def save_png(path, data, min_size=48):
    if b'<svg' in data[:1000].lower():
        return False

    try:
        image = Image.open(io.BytesIO(data))
        image.load()
        if image.mode not in ('RGB', 'RGBA'):
            image = image.convert('RGBA')

        width, height = image.size
        if width < min_size or height < min_size:
            scale = max(min_size / max(width, 1), min_size / max(height, 1))
            image = image.resize(
                (max(min_size, round(width * scale)), max(min_size, round(height * scale))),
                Image.LANCZOS,
            )

        image.save(path, format='PNG')
        return True
    except Exception:
        return False


def extract_meta_image(raw, website):
    patterns = [
        r'<meta[^>]+(?:property=["\']og:image["\']|name=["\']og:image["\'])[^>]*content=["\']([^"\']+)["\']',
        r'<meta[^>]+content=["\']([^"\']+)["\'][^>]*property=["\']og:image["\']',
        r'<meta[^>]+name=["\']twitter:image["\'][^>]*content=["\']([^"\']+)["\']',
    ]
    for pattern in patterns:
        match = re.search(pattern, raw, re.IGNORECASE)
        if match:
            return urljoin(website, html.unescape(match.group(1).strip()))
    return None


def extract_icon_candidates(raw, website):
    candidates = []
    patterns = [
        r'<link[^>]+href=["\']([^"\']+)["\'][^>]+rel=["\']([^"\']+)["\']',
        r'<link[^>]+rel=["\']([^"\']+)["\'][^>]+href=["\']([^"\']+)["\']',
    ]
    for pattern in patterns:
        for match in re.finditer(pattern, raw, re.IGNORECASE):
            first, second = match.groups()
            url, rel = (first, second) if first.startswith(('http', '/', '//')) else (second, first)
            if 'icon' in rel.lower():
                candidates.append(urljoin(website, html.unescape(url.strip())))

    meta = extract_meta_image(raw, website)
    if meta:
        candidates.append(meta)

    deduped = []
    seen = set()
    for candidate in candidates:
        if candidate not in seen:
            seen.add(candidate)
            deduped.append(candidate)
    return deduped


def fetch_icon(domain, website):
    sources = [
        f'https://logo.clearbit.com/{domain}?size=200',
        f'https://www.google.com/s2/favicons?domain={domain}&sz=256',
        f'https://{domain}/apple-touch-icon.png',
        f'https://{domain}/favicon.png',
        f'https://{domain}/favicon.ico',
    ]

    for src in sources:
        data = fetch_bytes(src, timeout=8)
        if is_valid_image(data):
            return data

    raw = fetch_html(website)
    if raw:
        for src in extract_icon_candidates(raw, website):
            data = fetch_bytes(src, timeout=8)
            if is_valid_image(data):
                return data

    return None


def fetch_wide(website):
    raw = fetch_html(website)
    if not raw:
        return None

    og_url = extract_meta_image(raw, website)
    if not og_url:
        return None

    data = fetch_bytes(og_url, timeout=10)
    if is_valid_image(data, min_bytes=1000):
        return data
    return None


with open(os.path.join(os.path.dirname(__file__), '..', 'src', 'data', 'companies.ts'), encoding='utf-8') as handle:
    content = handle.read()

pattern = r'id:\s*"([^"]+)".*?website:\s*"([^"]+)"'
companies = re.findall(pattern, content, re.DOTALL)
print(f'Found {len(companies)} companies')

results = {'icon_ok': 0, 'icon_skip': 0, 'icon_fail': 0, 'wide_ok': 0, 'wide_skip': 0, 'wide_fail': 0}

for index, (company_id, website) in enumerate(companies, start=1):
    domain = get_domain(website)
    if not domain:
        continue

    icon_path = os.path.join(LOGOS_DIR, f'{company_id}.png')
    wide_path = os.path.join(LOGOS_DIR, f'{company_id}-wide.png')

    if os.path.exists(icon_path) and os.path.getsize(icon_path) > 200:
        results['icon_skip'] += 1
    else:
        data = fetch_icon(domain, website)
        if data and save_png(icon_path, data):
            results['icon_ok'] += 1
            print(f'  [{index:3d}] icon  OK  {company_id}')
        else:
            results['icon_fail'] += 1
            print(f'  [{index:3d}] icon  XX  {company_id}  ({domain})')
        time.sleep(0.25)

    if os.path.exists(wide_path) and os.path.getsize(wide_path) > 1000:
        results['wide_skip'] += 1
    else:
        data = fetch_wide(website)
        if data and save_png(wide_path, data, min_size=160):
            results['wide_ok'] += 1
            print(f'  [{index:3d}] wide  OK  {company_id}')
        else:
            results['wide_fail'] += 1
        time.sleep(0.25)

print()
print('=== Results ===')
for key, value in results.items():
    print(f'  {key}: {value}')
