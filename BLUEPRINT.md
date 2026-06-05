# BLUEPRINT — Kapitalkart

> A reference for how this site is built: architecture, design system, data model and the
> performance strategy. Written so the project could be rebuilt from scratch, or extended
> confidently, without re-deriving the decisions.

Kapitalkart (repo: `ibmap`) is an interactive map of Nordic finance and investment companies —
**932 firms across Norway, Sweden, Finland, Denmark, Iceland, the Faroe Islands, Åland and
Greenland.** Users filter by category, jump to a city, search by name, click a pin to read what a
firm does, and can switch to a sortable/filterable table. Built for students and professionals
navigating the Scandinavian capital-markets landscape.

---

## 1. Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) | Single static page, client-rendered map |
| Language | **TypeScript 5** | Strict types in `src/types` and the data file |
| UI runtime | **React 19** | `'use client'` for every interactive component |
| Styling | **Tailwind CSS v4** | Imported via `@import "tailwindcss"` in `globals.css`; PostCSS plugin `@tailwindcss/postcss` |
| Map | **MapLibre GL v5** + **react-map-gl v8** (`react-map-gl/maplibre`) | WebGL renderer, no Mapbox token |
| Tiles | **OpenFreeMap** (light) + **CARTO basemaps** (dark) | No API key required |
| Icons | **lucide-react** | Stroke icons, sized per-call |
| Utils | `clsx`, `tailwind-merge` | Class composition |
| Deploy | **Vercel** | Zero-config; `next build` is the deploy path |

There is **no database and no backend**. All company data is a static TypeScript array compiled into
the bundle. The moat is data quality, not infrastructure. Logos are static files in `public/logos`.

### Scripts (Python, dev-time only — not part of the runtime)
- `scripts/geocode_registry.py` — addresses via Brreg (NO) / CVR (DK), geocode via Nominatim
- `scripts/apply_geocode_results.py` — patch `companies.ts` with geocode results
- `scripts/fetch_logos2.py` — fetch icon + wide logo per company

---

## 2. Directory map

```
src/
  app/
    layout.tsx        Root <html>; metadata; preconnect/preload for tiles
    page.tsx          App shell: view state, filters, dark mode, flyTo plumbing, splash screen
    globals.css       Design tokens, MapLibre overrides, glass utilities, animations
  components/
    layout/Header.tsx     Floating glass nav: view toggle, HQ/All, city + filter dropdowns, search, style/random/dark/github
    map/MapView.tsx       MapGL, clustering, viewport-culled logo markers, the scrolling banner
    ui/CompanyCard.tsx    Floating detail card (bottom sheet on mobile, side panel on desktop)
    ui/CompanyTable.tsx   Sortable + filterable table view
    ui/CompanyLogo.tsx    Resilient logo loader with multi-source fallback + lazy probing
  data/companies.ts   The dataset (Company[]) + FILTER_CATEGORIES
  types/index.ts      Company/Office types, category colours/short codes, MAP_STYLES
public/logos/         Per-company logo files: <id>.png/.svg/.jpg/.webp + <id>-wide.png
```

### State ownership
All cross-cutting state lives in **`page.tsx`** and is passed down as props (no global store):

- `view: 'map' | 'companies'`
- `filters: { category, country, city }`
- `showOffices`, `mapStyleKey`, `darkMode`
- **flyTo plumbing**: `MapView` registers a `flyTo(lat, lng, zoom)` callback up to the page via
  `onRegisterFlyTo`. The page keeps a `pendingFlyToRef` so a city/company selected *before* the map
  has mounted still gets honoured once the map registers. `onRegisterRandomCompany` works the same way.

---

## 3. Design system

### 3.1 Fonts
System font stack — **no web font is downloaded** (zero font latency, native feel):

```css
font-family: -apple-system, BlinkMacSystemFont, "Inter", "Segoe UI", Roboto, sans-serif;
```

Rendering hints: `-webkit-font-smoothing: antialiased`, `text-rendering: optimizeSpeed`.

**Type scale** is deliberately small and dense (data-dashboard feel), set in px via Tailwind
arbitrary values: `text-[9px]` … `text-[15px]`. Headings use `font-bold`/`font-black` with tight
tracking; labels use `uppercase tracking-widest`. The brand wordmark is
`font-black uppercase tracking-[0.13em]`.

### 3.2 Colour palette

**App chrome / neutrals**
| Token | Light | Dark |
|---|---|---|
| Background | `#f0f4f8` | `#000000` |
| Foreground text | `#0f172a` | `#f1f5f9` |
| Secondary text | `#64748b` | `#94a3b8` |
| Muted text | `#94a3b8` | `#64748b` |
| Marker accent (neutral pins/clusters) | `#94a3b8` | `#64748b` |

Neutrals are Tailwind **slate**. The map deliberately uses neutral grey pins/clusters so the
category colours only appear in the UI (badges, dots), keeping the map calm.

**Category colours** (`src/types/index.ts → CATEGORY_COLORS`) — each category has a Tailwind
`bg`/`text`/`border` set plus a hex `pin`:

| Category | Short | Pin hex |
|---|---|---|
| Asset Management | AM | `#2563EB` (blue) |
| Hedge Fund | HF | `#7C3AED` (violet) |
| Private Equity | PE | `#9333EA` (purple) |
| Venture Capital | VC | `#059669` (emerald) |
| Investment Banking | IB | `#D97706` (amber) |
| Fintech | FT | `#C026D3` (fuchsia) |
| Trading | TR | `#E11D48` (rose) |
| Consulting | CO | `#0D9488` (teal) |
| Holding | HL | `#EA580C` (orange) |
| Real Estate | RE | `#65A30D` (lime) |
| Shipping | SH | `#0891B2` (cyan) |
| Government | GV | `#475569` (slate) |

To add a category: extend `CompanyCategory`, then add entries to `CATEGORY_SHORT`,
`CATEGORY_COLORS`, and `FILTER_CATEGORIES` (in `companies.ts`). TypeScript will flag any you miss.

### 3.3 The "glass" aesthetic
The signature look is iOS-style frosted glass floating panels. Two reusable utilities in
`globals.css`:

```css
.glass       /* light: rgba(255,255,255,0.72) + blur(28px) saturate(180%) + hairline white border + soft shadow */
.glass-dark  /* dark:  rgba(0,0,0,0.82)      + same blur/saturate + subtle white border */
```

Most panels (nav, dropdowns, card, banner, table surface, MapLibre controls) build the same effect
inline so the blur/opacity can be tuned per surface. The recipe everywhere is:
**translucent background + `backdrop-filter: blur(16–32px) saturate(160–200%)` + 1px hairline border
+ layered soft shadow (often with an `inset 0 1px 0 rgba(255,255,255,…)` top highlight).**

Dark mode is driven by a single boolean in `page.tsx`; the root `<div>` gets `data-dark="true"`,
which `globals.css` uses to restyle MapLibre controls, and every component branches on a `dm`
(darkMode) flag to pick its colour set.

### 3.4 Radii, spacing, motion
- **Radii**: pills `rounded-full`; controls `rounded-xl`/`rounded-2xl`; the card `rounded-3xl`; the
  table container `rounded-[1.25rem]`.
- **Shadows**: low-opacity, large-blur, multi-layer (e.g. `0 8px 32px rgba(0,0,0,0.06)`).
- **Animations** (in `globals.css`): `slideInRight` (desktop card), `slideInUp` (mobile sheet),
  `fadeIn`, `scaleIn`, `ping` (selected-marker pulse), `banner-scroll` (infinite logo marquee),
  and the splash-screen `splash-ping`/`splash-dot`. Easing is mostly
  `cubic-bezier(0.16, 1, 0.3, 1)` (a soft "ease-out-back-ish" curve).
- **Reduced motion**: a `@media (prefers-reduced-motion: reduce)` block neutralises animations and
  stops the banner marquee for users who ask for it.

---

## 4. The map (`MapView.tsx`)

The map must stay smooth with ~900 points, so rendering is **two-tier** keyed off zoom:

```
zoom < CLUSTER_ZOOM (9)  →  GPU-rendered GeoJSON clusters + small dots (MapLibre circle layers)
zoom ≥ CLUSTER_ZOOM (9)  →  individual DOM logo markers (react-map-gl <Marker>)
```

DOM markers are expensive, so at high zoom they are aggressively limited:

- **Clustering**: a single `Source` with `cluster: true`, `clusterRadius: 50`,
  `clusterMaxZoom: CLUSTER_ZOOM - 1`. Three layers: `cluster-circles`, `cluster-count`,
  `unclustered-points` (the dots, whose radius drops to 0 once logo markers take over).
- **Viewport culling**: only markers inside the current bounds (+ `VIEWPORT_PAD`) are rendered;
  bounds are read from a non-reactive `viewportRef` and refreshed on `moveend`.
- **Hard cap**: `MAX_VISIBLE_MARKERS = 200` simultaneous DOM markers.
- **Progressive reveal**: on the cluster→markers transition, markers appear in batches of
  `MARKER_BATCH_SIZE (40)` every `MARKER_BATCH_DELAY (80ms)` via `startTransition`, so the frame
  that crosses the zoom threshold never tries to mount 200 nodes at once.
- **Debounced movement**: `moveend` is debounced `MOVE_DEBOUNCE_MS (120ms)` before state updates.
- **Jitter**: companies sharing identical coordinates are fanned out on a small circle
  (`jitterMarkers`) so stacked pins are clickable — computed only for currently-visible markers.

Other map behaviour:
- `INITIAL_VIEW` ≈ centred on the Nordics, zoom 3.1; `MAX_BOUNDS` fences the view to the region;
  `renderWorldCopies={false}` and `reuseMaps` reduce work.
- **Auto-fit**: changing filters fits bounds to the filtered set (or flies home for "ALL"), guarded
  by `lastAutoFitKeyRef` so it only fires when the filter actually changes.
- **flyTo policy**: direct pin clicks preserve the user's current zoom; programmatic focus
  (search/city/table) zooms in to at least `MIN_FOCUS_ZOOM (12)` but never zooms the user out.
- **Selection navigation**: `buildNavigationSequence` orders the filtered set as
  `[anchor → same city → same country → other countries]` so the card's ◀/▶ stepping feels spatial.
- **Banner**: a paused-on-hover / paused-when-pinned infinite marquee of (capped) filtered company
  logos, hidden on mobile.

The `MAP_STYLES` map (in `types/index.ts`) defines three styles (`minimal`/`detailed`/`vivid`), each
with a light and dark tile URL plus a `maskColor`/`maskOpacity` used to tint the basemap toward the
app background.

---

## 5. Logo loading (`CompanyLogo.tsx`)

Logos come from many sources of varying quality, so the loader is defensive:

1. **Source priority** (per company `id`): `-wide.png/svg/jpg` (when `wide`) → `.png/.svg/.jpg/.webp/.ico`
   → Clearbit (`logo.clearbit.com/<domain>`) → a coloured `Globe` fallback tile.
2. **Off-DOM probing**: each candidate URL is verified with `new Image()` *before* it is committed to
   the DOM, so a broken URL never flashes as a broken `<img>`.
3. **Session caches** (module-level `Map`s): `urlCache` (per-URL ok/err) and `bestSourceCache`
   (per-company resolved URL or `null`) mean a logo is probed at most once per session and instantly
   resolved on re-mount.
4. **Lazy probing**: an `IntersectionObserver` (`rootMargin: 300px`) defers probing until the logo is
   near the viewport. This is what keeps the **932-row table** cheap — only on-screen logos hit the
   network. Already-cached logos skip the wait entirely.

> Native `<img>` is used intentionally (not `next/image`): the custom multi-source probing and the
> static `Cache-Control: immutable` header on `/logos/*` (see `next.config.ts`) already handle
> optimisation, and most logos are tiny.

---

## 6. Data model (`src/data/companies.ts`, `src/types/index.ts`)

```ts
interface Company {
  id: string                 // slug; also the logo filename stem (public/logos/<id>.png)
  name: string
  category: CompanyCategory  // drives colour + short code
  website: string
  address?: string           // full HQ street address (falls back to "City, Country")
  city: string
  country: string
  lat?: number; lng?: number // HQ pin; omit to keep a firm in the table but off the map
  offices?: CompanyOffice[]  // satellite locations (shown when "All" offices is on)
  description: string
  aum?: string               // "~NOK 30bn" — free text
  employees?: string         // "30–60" — free text
  isNordic?: boolean
}
```

Adding a company = appending one object to the array (see README for the template). A firm with no
`lat`/`lng` still appears in the table (marked "no map pin"). `aum`/`employees` are free-text so they
can hold ranges and approximations.

---

## 7. Performance strategy (summary)

The site is a single static page; the heavy parts are the WebGL map and ~900 logos. Levers in place:

- **Map**: clustering + viewport culling + 200-marker cap + batched reveal + debounced moves
  (see §4).
- **Logos**: off-DOM probing + session caches + IntersectionObserver lazy load (see §5).
- **Table**: `content-visibility: auto` (`.cv-row`) skips layout/paint for off-screen rows, giving
  near-virtualised scrolling for 900+ rows without a windowing library.
- **First paint**: `layout.tsx` `preconnect`s to the tile/font CDNs and `preload`s the default map
  style; the map is `dynamic(ssr:false)` behind a lightweight branded splash so the shell paints
  instantly.
- **Caching**: `next.config.ts` sets `Cache-Control: public, max-age=31536000, immutable` on
  `/logos/*` and enables response compression.
- **GPU hints** in `globals.css`: `contain`/`will-change`/`content-visibility` on the map container
  and marker elements.
- **CSS over JS motion**: animations are pure CSS keyframes, with reduced-motion honoured.

---

## 8. Conventions & gotchas

- **Dark mode** is prop-drilled as a `dm`/`darkMode` boolean; every styled surface defines a
  light and dark colour pair inline. There is no `dark:` Tailwind variant in use — keep both halves
  in sync when editing a panel.
- **Colours are split**: structural neutrals via Tailwind classes; brand/category and glass values as
  inline hex/rgba (so opacity and blur are tunable per surface).
- **Hooks order**: components render large lists — keep all hooks above any early `return`
  (the banner bug where `return null` preceded a `useMemo` was a real defect; don't reintroduce it).
- **Lint**: the repo trips Next's newer `react-hooks/set-state-in-effect` rule in a few places
  (the logo loader and the table's country/city reconciliation). These are intentional
  synchronisations and do **not** block `next build` (the Vercel deploy path).
- **No backend**: everything ships in the bundle. At this scale that's a feature, not debt.
```
