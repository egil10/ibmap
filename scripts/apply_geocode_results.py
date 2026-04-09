"""
Apply geocode_registry_results.json → patch companies.ts with lat/lng + corrected city.
Only writes to companies where coords are missing or being corrected.
"""
import re, sys, json, os

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

BASE    = os.path.join(os.path.dirname(__file__), '..')
RESULTS = os.path.join(os.path.dirname(__file__), 'geocode_registry_results.json')
TS_FILE = os.path.join(BASE, 'src', 'data', 'companies.ts')

with open(RESULTS, encoding='utf-8') as f:
    results = json.load(f)

with open(TS_FILE, encoding='utf-8') as f:
    content = f.read()

applied = 0
skipped = 0

for cid, data in results.items():
    lat = data.get('lat')
    lng = data.get('lng')
    if not lat or not lng:
        skipped += 1
        continue

    # Find the company block for this id
    # Pattern: look for the block containing id: "cid" without lat: already present
    pattern = rf'(\{{  id: "{re.escape(cid)}"[^}}]*?\}})'
    m = re.search(pattern, content, re.DOTALL)
    if not m:
        print(f'  NOT FOUND: {cid}')
        skipped += 1
        continue

    block = m.group(1)

    # Skip if already has lat
    if 'lat:' in block:
        skipped += 1
        continue

    # Insert lat/lng after the country line
    new_block = re.sub(
        r"(    country: \"[^\"]+\")",
        rf'\1\n    lat: {lat},\n    lng: {lng},',
        block
    )

    if new_block == block:
        print(f'  PATCH FAILED: {cid}')
        skipped += 1
        continue

    content = content.replace(block, new_block)
    applied += 1
    print(f'  ✓  {cid:40s}  {lat}, {lng}  [{data.get("source","?")}]')

with open(TS_FILE, 'w', encoding='utf-8') as f:
    f.write(content)

print(f'\nApplied: {applied}  |  Skipped/failed: {skipped}')
