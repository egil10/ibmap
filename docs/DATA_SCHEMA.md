# Data Schema

All company data lives in `src/data/companies.ts` as a typed TypeScript array.

## Company Interface

```ts
interface Company {
  id: string           // Required. Unique kebab-case slug. Used as React key.
  name: string         // Required. Display name of the company.
  category: CompanyCategory  // Required. See categories below.
  website: string      // Required. Full URL including https://
  city: string         // Required. City of the primary/HQ office.
  country: string      // Required. Country of the primary/HQ office.
  lat: number          // Required. Latitude in decimal degrees (WGS84).
  lng: number          // Required. Longitude in decimal degrees (WGS84).
  description?: string // Optional. 1–2 sentences about what the firm does.
  aum?: string         // Optional. Assets under management (free text, e.g. "~NOK 30bn").
  employees?: string   // Optional. Headcount range (e.g. "30-60", "200+").
  isNordic?: boolean   // Optional. True if the HQ is outside Norway but has a Nordic presence.
}
```

## Category Codes

| Code | Full Name              | Examples                          |
|------|------------------------|-----------------------------------|
| AM   | Asset Management       | NBIM, KLP, Storebrand, Holberg    |
| PE   | Private Equity         | FSN Capital, HitecVision, Ferd    |
| VC   | Venture Capital        | Antler, Hadean, Sandwater, Snø    |
| IB   | Investment Banking     | ABG Sundal Collier                |
| TR   | Trading                | Svelland Capital, Hartree, Glencore|
| MC   | Management Consulting  | McKinsey Oslo, BCG Oslo, Bain     |
| HF   | Hedge Fund             | (future)                          |
| HL   | Holding                | Arendals Fossekompani             |
| SH   | Shipping               | SSY                               |

## Finding Coordinates

The easiest ways to get lat/lng for a company HQ:

1. **Google Maps** — search the address, right-click anywhere → "What's here?" → decimal coordinates appear at the bottom
2. **Google Maps URL** — when you navigate to a place, the URL contains `@lat,lng,zoom`
3. **what3words / geojson.io** — draw a point, copy coordinates

Precision to 4 decimal places is more than sufficient (~10m accuracy).

## Data Quality Guidelines

- Use the **registered HQ address**, not a satellite office
- For companies with offices in multiple Norwegian cities, use the city where the investment team sits
- `isNordic: true` should be set for firms whose primary HQ is outside Norway (Stockholm, London, etc.) but that have meaningful Norwegian/Nordic operations
- Keep `description` factual and neutral — 1–2 sentences max
- `aum` values should be approximate and include the currency prefix (NOK/EUR/USD)

## Source Data

The initial dataset was compiled from:
- `PE_VC_AM_MC_IBD_TR.xlsx` — manually curated spreadsheet with company names, categories, and websites
- Company websites for descriptions and AUM figures
- LinkedIn for headcount estimates

## Adding New Companies

1. Open `src/data/companies.ts`
2. Add a new object to the `companies` array following the schema above
3. Choose a unique `id` (kebab-case of the company name)
4. Get lat/lng from Google Maps
5. Run `npm run dev` to verify the pin appears correctly
6. Submit a PR
