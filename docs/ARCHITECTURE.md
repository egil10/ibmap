# Architecture

## Overview

IBMap is a single-page Next.js application. The entire interface is a full-screen map with floating UI layers on top.

```
┌─────────────────────────────────────────────────────┐
│  Header (floating top bar)                          │
│  ┌─────────────────┐  ┌──────────────┐  ┌────────┐ │
│  │  IBMap logo     │  │ Search input │  │ 97 firms│ │
│  └─────────────────┘  └──────────────┘  └────────┘ │
│                                                     │
│              MapLibre GL Map                        │
│           (OpenFreeMap positron tiles)              │
│                  ● ● ●  ← company pins              │
│                ●                                    │
│                    ●    ●                           │
│                                         ┌─────────┐│
│                                         │ Company ││
│                                         │  Card   ││
│                                         │ (panel) ││
│                                         └─────────┘│
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │  FilterBar: ALL AM PE VC IB TR MC HL SH     │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## Component Tree

```
page.tsx (server)
  └── MapView (client, dynamically imported)
        ├── Map (react-map-gl/maplibre)
        │     ├── Marker × N (company pins)
        │     └── NavigationControl
        ├── Header (floating top)
        ├── CompanyCard (floating right, conditional)
        └── FilterBar (floating bottom)
```

## Key Decisions

### Map Library: MapLibre GL JS
- Open-source fork of Mapbox GL JS
- **No API key required** — uses OpenFreeMap tiles (free, unlimited)
- Identical API surface to Mapbox GL JS; easy to swap if needed
- Bundled via `react-map-gl` v8 (same library supports both)

### Map Tiles: OpenFreeMap Positron
- `https://tiles.openfreemap.org/styles/positron`
- Minimal, light-grey style — ideal for data overlays
- Completely free, self-hosted by the OpenFreeMap project
- No attribution required (though appreciated)

### Rendering: Client-side only
- The Map component uses browser APIs (WebGL) — cannot SSR
- Loaded via `dynamic(() => ..., { ssr: false })` in `page.tsx`
- Loading spinner shown while JS hydrates

### State Management: Local React state
- `selected: Company | null` — currently selected company
- `filter: FilterCategory` — active category filter
- `search: string` — search query
- All in `MapView` — no external state library needed at this scale

### Data: Static TypeScript module
- All company data lives in `src/data/companies.ts`
- Imported at build time — zero runtime data fetching
- Easy to edit, type-checked, tree-shakeable

## Design System

### Glass Morphism
All floating UI elements use the same glass recipe:
```css
background: rgba(255, 255, 255, 0.85);
backdrop-filter: blur(16px) saturate(180%);
border: 1px solid rgba(255, 255, 255, 0.7);
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
border-radius: 16px;
```

### Company Pin Colors
Each category has a distinct color from a carefully chosen palette:
- AM → Blue `#2563EB`
- PE → Purple `#7C3AED`
- VC → Emerald `#059669`
- IB → Amber `#D97706`
- TR → Rose `#E11D48`
- MC → Teal `#0D9488`

Defined in `src/types/index.ts` → `CATEGORY_COLORS`.

## Performance Notes

- Markers are React components rendered via Mapbox Marker API
- At ~100 pins, React rendering is negligible
- For 1000+ pins, consider switching to MapLibre data-driven layers (GeoJSON source + circle layer) for GPU-rendered points
