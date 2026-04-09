# Kapitalkart

Interactive map of Nordic finance and investment companies. Built for students and professionals navigating the Scandinavian capital markets landscape.

## What it does

Pins ~160 firms across Norway, Sweden, Denmark, and Finland on a clean interactive map. Filter by category, jump to a city, click a pin to see what the firm does, their AUM, headcount, and website. Switch to a sortable table view for a full company list.

**Categories:** Asset Management · Hedge Fund · Private Equity · Venture Capital · Investment Banking · Trading · Consulting · Holding

## Stack

Next.js 16 · TypeScript · Tailwind CSS · MapLibre GL · OpenFreeMap tiles · Vercel

No API keys required.

## Getting started

```bash
git clone https://github.com/egil10/ibmap.git
cd ibmap
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000).

## Adding a company

Edit `src/data/companies.ts`:

```ts
{
  id: 'company-slug',
  name: 'Company Name',
  category: 'Private Equity',
  website: 'https://...',
  city: 'Oslo',
  country: 'Norway',
  lat: 59.9139,
  lng: 10.7522,
  description: 'One or two sentences.',
  aum: '~NOK 30bn',      // optional
  employees: '30–60',    // optional
  offices: [             // optional satellite offices
    { city: 'Stockholm', country: 'Sweden', lat: 59.33, lng: 18.07 }
  ],
}
```

## Scripts

| Script | Purpose |
|---|---|
| `scripts/geocode_registry.py` | Look up addresses via Brreg (NO) and CVR (DK), geocode via Nominatim |
| `scripts/apply_geocode_results.py` | Patch `companies.ts` with results from above |
| `scripts/fetch_logos2.py` | Fetch icon + wide logo for each company |

## Deployment

Push to GitHub, connect to Vercel. Zero config.
