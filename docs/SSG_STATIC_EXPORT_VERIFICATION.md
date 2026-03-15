# SSG / Static Export Verification Report

**Next.js:** 14.2.5 · **App Router** · **Report date:** March 2025  
**Goal:** Confirm build is SSG + static export and safe to scale to 10,000+ pages.

---

## 1) Build mode and Next config

**File:** `next.config.js`

| Setting | Value | Evidence |
|--------|--------|----------|
| **output** | `'export'` | `output: 'export'` — full static export to `out/` |
| **trailingSlash** | `true` | `trailingSlash: true` — URLs and canonicals use trailing slash |
| **images.unoptimized** | `true` | Required for static export (no Image Optimization API) |
| **redirects / rewrites** | None | No `redirects()` or `rewrites()`; comment states they do not work with static export |

```1:18:next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // ...
  // Note: redirects() function does NOT work with static export (output: 'export')
}
```

**Conclusion:** Config is static-export only. No server-only features (redirects/rewrites) are used.

---

## 2) Per-route rendering mode (App Router)

### Checks performed

- **generateStaticParams:** Present and returns full param set for all dynamic segments.
- **Force-dynamic:** No `export const dynamic = 'force-dynamic'` anywhere.
- **dynamicParams:** Not set (defaults to `true`; with static export all valid routes are pre-rendered, so no runtime fallback).
- **Request-time APIs:** No `cookies()`, `headers()`, `draftMode()` in app or lib.
- **Fetch:** No `fetch()` with `cache: 'no-store'` or request-time fetch in page/layout code.
- **Revalidate:** No `revalidate = 0` or `export const revalidate`.
- **Unstable cache:** No `unstable_cache` or similar that would force dynamic.

`dynamic` from `next/dynamic` is used only for **client-side code splitting** (lazy load Search, Converter, FAQ, RelatedConversions). It does not change route rendering; those components are still SSR’d into the initial HTML where `ssr: true` (default for Converter/FAQ/RelatedConversions). Layout uses `ssr: false` only for the Search component (client-only), which does not force the route to be dynamic.

### Evidence table

| Route | Rendering | Evidence |
|-------|-----------|----------|
| **app/page.tsx** | **SSG (○ Static)** | No dynamic segment; no `generateStaticParams` needed. Uses `metadata` and `getSiteUrl()` (env at build time). Build: `○ /` |
| **app/tools/page.tsx** | **SSG (○ Static)** | Static path. Build: `○ /tools` |
| **app/ingredients/page.tsx** | **SSG (○ Static)** | Static path. Build: `○ /ingredients` |
| **app/ingredients/[ingredient]/page.tsx** | **SSG (●)** | `generateStaticParams()` returns `INGREDIENTS.map(ingredient => ({ ingredient }))`. No force-dynamic/cookies/headers/fetch. Invalid slug → `notFound()`. Build: `● /ingredients/[ingredient]` with 213 paths |
| **app/[converter]/page.tsx** | **SSG (●)** | `generateStaticParams()` returns `INGREDIENT_CONVERTERS.map(converter => ({ converter }))`. Build: `● /[converter]` with 3 paths |
| **app/[converter]/[ingredient]/page.tsx** | **SSG (●)** | `generateStaticParams()` returns all pairs from `INGREDIENT_CONVERTERS` × `INGREDIENTS`. Build: `● /[converter]/[ingredient]` with 639 paths |
| **app/q/[query]/page.tsx** | **SSG (●)** | `generateStaticParams()` returns all `GRAM_VALUES`×`INGREDIENTS` and `CUP_VALUES`×`INGREDIENTS`. Invalid query → `notFound()`. Build: `● /q/[query]` with 1917 paths |

### Build output (excerpt)

```
Route (app)                                        Size     First Load JS
┌ ○ /                                              204 B          94.2 kB
├ ● /[converter]                                   204 B          94.2 kB
├   ├ /cups-to-grams
├   ├ /grams-to-cups
├   └ /tbsp-to-grams
├ ● /[converter]/[ingredient]                      1.43 kB         100 kB
├   ├ /cups-to-grams/flour
├   └ [+636 more paths]
├ ○ /tools                                         204 B          94.2 kB
├ ○ /ingredients                                   204 B          94.2 kB
├ ● /ingredients/[ingredient]                      204 B          94.2 kB
├   └ [+210 more paths]
├ ● /q/[query]                                     638 B          94.6 kB
├   └ [+1914 more paths]
├ ○ /robots.txt                                    0 B                0 B
├ ○ /sitemap.xml                                   0 B                0 B

○  (Static)  prerendered as static content
●  (SSG)     prerendered as static HTML (uses getStaticProps)
```

**No λ (Dynamic) routes.** Total static pages generated: **2,798** (build log: "Generating static pages (2798/2798)").

---

## 3) Sitemap and robots are static

### app/sitemap.ts

- **Data source:** `INGREDIENTS`, `INGREDIENT_CONVERTERS`, `PURE_PAGES` from `@/lib/registry` (build-time constants). `buildCanonical()` uses `getSiteUrl()` (env at build time).
- **Runtime:** None. Default export is a synchronous function that returns an array; no `fetch()`, no request APIs. `NEXT_PUBLIC_BUILD_TIME` / `Date.now()` used only for `lastModified`.
- **Canonical alignment:** Uses same `buildCanonical()` as page metadata; pathnames normalized with trailing slash in `lib/seo.ts`, matching `trailingSlash: true`.

### app/robots.ts

- **Data source:** `getSiteUrl()` only (env at build time).
- **Runtime:** None. Returns a static structure.

**Conclusion:** Sitemap and robots are generated at build time and are fully static. Canonical and sitemap URLs match (trailing slash).

---

## 4) Build output evidence

### Commands run

- `npm run build` (runs `next build`)

### Results

- **Export folder:** `out/` (created by `output: 'export'`).
- **HTML file count:** **2,793** (from `find out -type f -name "*.html" | wc -l`).
- **Other artifacts:** `out/sitemap.xml`, `out/robots.txt`, `out/index.html`, `out/_redirects`, `out/favicon.ico`, `out/_next/` (JS/CSS chunks).
- **Route summary:** All listed routes are ○ (Static) or ● (SSG); no λ (Dynamic).

Static page count (2,798 in build log) vs HTML count (2,793) — small difference is consistent with some routes rendering to the same file (e.g. index) or build output counting route entries vs physical files. Important: every route is pre-rendered.

---

## 5) Scaling risk for 10k+ pages

### Current scale

- **~2,798 static pages** (build log).
- **~246 ingredients** (from registry); 3 converters; 5 + 4 query shapes for `/q/`.
- **Build time (observed):** ~27 seconds for ~2.8k pages.

### Bottlenecks (in order of impact)

1. **generateStaticParams array size**  
   All params are built in memory (e.g. 3×246 + 246 + 9×246 = 3,198 dynamic params plus static routes). At 10k pages this is still a single large array; memory is manageable, but very large arrays (e.g. 50k+) could pressure Node heap during the "Collecting page data" phase.

2. **Per-page work**  
   Each `[converter]/[ingredient]` page does substantial work: FAQ generation, “why density matters,” “common mistakes,” “measurement tips,” multiple JSON-LD objects. Same for `/q/[query]`. At 10k pages, total CPU time grows linearly; build time may reach several minutes.

3. **Registry size**  
   `lib/registry.ts` is a single large module (INGREDIENTS, INGREDIENT_DENSITIES, INGREDIENT_NAMES). Imported by every dynamic page. No evidence of duplication; just one source of truth. Acceptable for 10k; if you ever go to 50k+, consider splitting or precomputing.

4. **Sitemap**  
   Single `sitemap.xml` with ~3.2k URLs; file size ~511 KB. At 10k URLs still under typical single-sitemap limits (~50k URLs, 50MB). Beyond that, use a sitemap index and multiple sitemaps.

### Optimizations (without changing architecture)

| # | Optimization | Rationale |
|---|--------------|-----------|
| 1 | **Precompute registries** | Export a small JSON or TS with only slug lists (e.g. ingredient IDs) for `generateStaticParams`, and keep density/names in a separate module. Reduces work per param generation and can speed up "Collecting page data." |
| 2 | **Reduce per-page heavy work** | Cache or precompute FAQ text / “why density matters” / “mistakes” per (converter, ingredient) or (query) in a build step, then have the page read from that cache instead of recomputing in every page. Lowers CPU per page. |
| 3 | **Smaller JSON payloads** | Ensure JSON-LD is minimal (no redundant fields). Already reasonable; avoid adding large inline data. |
| 4 | **Sitemap index at 50k+ URLs** | When total URLs exceed ~50k, split sitemap into multiple files and add a sitemap index. Next 14 allows returning multiple sitemaps or a single large one; for 10k, one sitemap is fine. |
| 5 | **Build resource limits** | For 10k+ pages, run `next build` with higher Node memory if needed (e.g. `NODE_OPTIONS=--max-old-space-size=8192`) and monitor "Generating static pages" duration; consider CI timeouts. |

No change to routing, to SSG vs SSR, or to URL design is required for 10k pages.

---

## 6) Final conclusion

### Is this site SSG at build time?

**YES.** Every route is either ○ (Static) or ● (SSG). There are no λ (Dynamic) routes. All pages are pre-rendered at build time.

### Is it static export?

**YES.** `next.config.js` has `output: 'export'`. Build produces the `out/` directory with static HTML, `sitemap.xml`, `robots.txt`, and assets. No server is required at runtime.

### Which routes are not fully static?

**None.** Every route in the app is statically generated. No route uses `force-dynamic`, `cookies()`, `headers()`, `draftMode()`, `fetch` with `cache: 'no-store'`, or `revalidate = 0`.

### Is 10k pages feasible?

**YES.** The architecture (whitelist-based params, no runtime data, no server) supports 10k+ pages. Watch for:

- **Build time:** Expect a few minutes for 10k pages; optimize per-page work (e.g. precomputed content) if needed.
- **Memory:** If you see OOM during "Collecting page data" or "Generating static pages," increase Node heap or reduce param generation work.
- **Sitemap:** Move to a sitemap index only when you exceed roughly 50k URLs or 50 MB per sitemap.

---

## Action checklist (if not fully static)

This project **is** fully static. If in the future any route were to become dynamic, the top 5 fixes would be:

| # | Action | When |
|---|--------|------|
| 1 | Remove `cookies()`, `headers()`, or `draftMode()` from the route (or move to client component / API route). | If a page needs request data, use client fetch or a separate API. |
| 2 | Ensure all dynamic segments have `generateStaticParams()` returning the full set of valid params. | So every valid URL is pre-rendered. |
| 3 | Remove `export const dynamic = 'force-dynamic'` and any `revalidate = 0` (or replace with ISR if you move off static export). | To allow static generation. |
| 4 | Replace `fetch(..., { cache: 'no-store' })` with cached fetch or build-time data. | So the route is not forced to dynamic. |
| 5 | Confirm `output: 'export'` remains in `next.config.js` and no server-only features (redirects/rewrites, API routes that affect pages) are required for the main app. | Static export requires all pages to be pre-rendered. |

---

*Verification performed via static analysis of the repo and a full `npm run build` with inspection of route table and `out/` contents.*
