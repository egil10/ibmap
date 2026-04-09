# IBMap — Norwegian Finance & Investment Map

An interactive map for discovering finance and investment companies in Norway. Built for students at NHH, BI, and anyone navigating the Norwegian financial ecosystem.

---

## What it is

IBMap pins ~100 finance and investment firms on a clean map of Norway (and the Nordics), letting you discover firms you'd never find on LinkedIn or a spreadsheet. Click a pin to see what the company does, their AUM, size, website, and city.

**Categories covered:**
- **AM** — Asset Management (NBIM, KLP, Storebrand, Holberg, Sector…)
- **PE** — Private Equity (FSN Capital, HitecVision, Ferd, Norvestor…)
- **VC** — Venture Capital (Antler, Hadean, Sandwater, Snø…)
- **IB** — Investment Banking (ABG Sundal Collier…)
- **TR** — Trading (Svelland, Hartree, Glencore…)
- **MC** — Management Consulting (McKinsey, BCG, Bain…)
- **HL** — Holding Companies
- **SH** — Shipping & Finance

---

## Tech Stack

| Layer       | Technology                                |
|-------------|-------------------------------------------|
| Framework   | Next.js 16 (App Router) |
| Styling     | Tailwind CSS v4 |
| Map         | MapLibre GL JS via react-map-gl |
| Map Tiles   | OpenFreeMap — free, no API key needed |
| Icons       | Lucide React |
| Language    | TypeScript |
| Deployment  | Vercel |

---

## Getting Started

```bash
git clone https://github.com/egil10/ibmap.git
cd ibmap
npm install
npm run dev
```

Open http://localhost:3000. **No API keys needed.**

---

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout + metadata
│   ├── page.tsx            # Entry point
│   └── globals.css         # Global styles + MapLibre overrides
├── components/
│   ├── map/MapView.tsx     # Main map with markers and state
│   ├── ui/CompanyCard.tsx  # Sliding detail panel
│   ├── ui/FilterBar.tsx    # Floating bottom filter pills
│   └── layout/Header.tsx  # Floating top bar
├── data/companies.ts       # All ~100 companies with coordinates
└── types/index.ts          # Types and category config
```

---

## Adding Companies

Edit `src/data/companies.ts`:

```ts
{
  id: 'company-slug',
  name: 'Company Name',
  category: 'PE',   // AM | PE | VC | IB | TR | MC | HF | HL | SH
  website: 'https://...',
  city: 'Oslo',
  country: 'Norway',
  lat: 59.9139,
  lng: 10.7522,
  description: 'One sentence.',
  aum: '~NOK 30bn',    // optional
  employees: '30-60',  // optional
}
```

---

## Deployment

Push to GitHub and connect to Vercel. Zero config needed — it just works.