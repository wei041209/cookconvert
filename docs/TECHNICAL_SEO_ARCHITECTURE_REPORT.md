# Technical SEO & Architecture Report — CookConvert

**Framework:** Next.js 14 · **Deployment:** Static export (`output: 'export'`) · **Type:** Programmatic SEO cooking conversion tool  
**Report date:** March 2025

---

## 1. Project Structure

### Folder structure (`/app`)

```
app/
├── layout.tsx                    # Root layout, nav, footer, default metadata
├── page.tsx                      # Homepage
├── sitemap.ts                    # Dynamic sitemap (build-time)
├── robots.ts                     # robots.txt
├── [converter]/                  # Dynamic: cups-to-grams | grams-to-cups | tbsp-to-grams
│   ├── page.tsx                  # Converter hub (ingredient grid)
│   └── [ingredient]/page.tsx     # Ingredient-specific converter page
├── ingredients/
│   ├── page.tsx                  # Ingredients hub
│   └── [ingredient]/page.tsx     # Ingredient guide page
├── q/
│   └── [query]/page.tsx          # Long-tail query pages (e.g. 200-grams-flour-to-cups)
├── guides/
│   ├── page.tsx
│   └── [slug]/page.tsx           # 5 static guide slugs
├── about/, contact/, privacy/, terms/
├── cups-to-ml/, ml-to-cups/, oz-to-grams/, grams-to-oz/, tbsp-to-ml/, tsp-to-ml/  # Pure math converters
└── (no pages/ directory — App Router only)
```

### Dynamic routes

| Route pattern | Example | Source of truth |
|---------------|---------|------------------|
| `[converter]` | `/cups-to-grams/` | `INGREDIENT_CONVERTERS` (3 values) |
| `[converter]/[ingredient]` | `/cups-to-grams/flour/` | `INGREDIENT_CONVERTERS` × `INGREDIENTS` |
| `ingredients/[ingredient]` | `/ingredients/flour/` | `INGREDIENTS` |
| `q/[query]` | `/q/200-grams-flour-to-cups/` | `GRAM_VALUES` × `INGREDIENTS` + `CUP_VALUES` × `INGREDIENTS` |

All dynamic routes use **whitelist validation**: invalid `converter` or `ingredient` triggers `notFound()`. No `dynamicParams` is set (defaults to `true` in Next 14; with `generateStaticParams` returning the full set, 404s for unknown slugs are correct).

### Estimated total generated pages

| Category | Formula | Count |
|----------|---------|--------|
| Static (home, about, privacy, terms, contact, tools, ingredients, guides) | 8 | 8 |
| Guide slugs | 5 | 5 |
| Pure converter pages | `PURE_PAGES` | 6 |
| Converter hub pages | `INGREDIENT_CONVERTERS` | 3 |
| Converter × ingredient | 3 × **246** | **738** |
| Ingredient guides | **246** | **246** |
| Long-tail `/q/` (grams-to-cups) | 5 × 246 | 1,230 |
| Long-tail `/q/` (cups-to-grams) | 4 × 246 | 984 |
| **Total** | | **~3,226** |

*Ingredient count taken from `lib/registry.ts` `INGREDIENTS` array (~246 entries).*

---

## 2. SEO Metadata

### Representative pages

| Page type | `<title>` | Meta description | Canonical | OpenGraph | JSON-LD |
|-----------|------------|------------------|------------|------------|---------|
| **Home** | CookConvert - Free Cooking Measurement Converter | Yes (buildMetadata) | Yes (via layout/metadataBase + page) | Yes (buildMetadata) | WebSite + SearchAction |
| **[converter]/[ingredient]** | e.g. *Cups to Grams for Flour — Accurate Conversion Chart & Free Calculator - CookConvert* | Unique per ingredient/converter, benefit suffix, ≤155 chars | Yes, trailing slash | Yes (title, description, url, og:image) | BreadcrumbList, FAQPage, Article |
| **ingredients/[ingredient]** | e.g. *Flour — Density, Conversion Chart & Cooking Tips - CookConvert* | Density + “cups-to-grams table, measuring tips” | Yes | Yes | BreadcrumbList, FAQPage, Article |
| **q/[query]** | e.g. *200g Flour to Cups — Exact Result + Conversion Chart - CookConvert* | Exact result + density-based | Yes (normalized pathname) | Yes | BreadcrumbList, FAQPage, Article |
| **Pure (e.g. cups-to-ml)** | Cups to Milliliters Converter - CookConvert | Unique, benefit-focused | Yes | Yes | BreadcrumbList, FAQPage, Article |

### Implementation details

- **Title:** `lib/seo.ts` `buildTitle()` — page title + “ - CookConvert”, trimmed to 65 chars.
- **Description:** `buildDescription()` — appends benefit suffix (“Instant conversion, accurate density…”), truncated at word boundary to 155 chars.
- **Canonical:** `buildCanonical(pathname)` in `buildMetadata()`; pathname normalized with **trailing slash** for non-root (aligned with `next.config.js` `trailingSlash: true`). Sitemap uses same `buildCanonical()`, so `<loc>` and `<link rel="canonical">` match.
- **OpenGraph:** Title, description, url (canonical), siteName, type, locale, image (`/og.png` 1200×630).
- **Twitter:** summary_large_image, title, description, image.
- **Structured data:** BreadcrumbList (all key pages), FAQPage (generated FAQs), Article (headline, description, url, datePublished/Modified, author/publisher) for E-E-A-T. Homepage has WebSite + SearchAction.

---

## 3. Programmatic Page Generation

### Where pages are generated

| Route | Mechanism | Data source |
|-------|-----------|-------------|
| `[converter]` | `generateStaticParams()` in `app/[converter]/page.tsx` | `INGREDIENT_CONVERTERS` |
| `[converter]/[ingredient]` | `generateStaticParams()` in `app/[converter]/[ingredient]/page.tsx` | `INGREDIENT_CONVERTERS` × `INGREDIENTS` |
| `ingredients/[ingredient]` | `generateStaticParams()` in `app/ingredients/[ingredient]/page.tsx` | `INGREDIENTS` |
| `q/[query]` | `generateStaticParams()` in `app/q/[query]/page.tsx` | `GRAM_VALUES` (5) × `INGREDIENTS` + `CUP_VALUES` (4) × `INGREDIENTS` |

All slugs are **whitelisted** in `lib/registry.ts`; no user or external input drives URL generation.

### How ingredient/converter pages are created

- **Converter × ingredient** (`/[converter]/[ingredient]`): For each pair, the page includes:
  - Unique H1 and meta title/description.
  - Converter-specific intro (“Convert cups to grams for {ingredient}…”), density-based paragraph.
  - **Differentiated content:** “Why density matters” and “Common cooking mistakes” and “Measurement tips” are **generated per ingredient/type** (flour vs sugar vs dairy vs oil vs liquid vs generic) and per converter (cups-to-grams, grams-to-cups, tbsp-to-grams), so text is not a single global template.
  - Conversion table and calculator (density from `INGREDIENT_DENSITIES`).
  - 8 FAQs generated per converter type and ingredient (formula + density + comparisons).
  - EEAT section, related conversions (same ingredient other converters + same converter other ingredients), link to ingredient guide.

- **Ingredient hub page** (`/ingredients/[ingredient]`): Intro paragraph (for ~20 ingredients from a content map, else generic “{name} has a density of X g/cup”), cups-to-grams table, 5 FAQs, tips list, related converter links, popular ingredients.

- **Long-tail** (`/q/[query]`): Prominent result box, explanatory copy (amount + ingredient + density), conversion details table, 8 FAQs (amount-specific), related converter and ingredient guide links.

### Thin-content risk

- **Low–medium for converter × ingredient:** Each page has multiple sections of **ingredient- and converter-specific** prose (why density matters, mistakes, tips), 8 FAQs, table, calculator, and internal links. Not “only” a conversion table.
- **Medium for ingredient hub:** Many ingredients use the fallback line “{name} has a density of X g/cup” plus shared tips; only a subset have custom intro copy. Consider expanding the content map for more ingredients.
- **Low for /q/:** Pages are clearly query-specific (e.g. “200g flour to cups”), with unique result, copy, and FAQs; they support long-tail intent and link to main converter/ingredient pages.

---

## 4. Indexing Signals

### Sitemap

- **File:** `app/sitemap.ts`.
- **Behavior:** Returns a single `MetadataRoute.Sitemap` array; all URLs built with `buildCanonical()`, so same trailing-slash format as canonicals.
- **Contents:** Home, tools, ingredients, about, privacy, terms, contact, guides (index + 5 slugs), pure pages, converter×ingredient, ingredient guides, and all `/q/` combinations. `lastModified` uses `NEXT_PUBLIC_BUILD_TIME` or build time for determinism. Priorities: home 1, tools/ingredients 0.9, guides 0.8, converter/ingredient/q 0.7–0.8, legal 0.3–0.5.

### robots.txt

- **File:** `app/robots.ts`.
- **Rules:** `Allow: /`, no disallow. `Sitemap: {siteUrl}/sitemap.xml`. No crawl blocking.

### Canonical configuration

- Every page that uses `buildMetadata()` gets `alternates.canonical` from `buildCanonical(pathname)`.
- Pathnames are normalized in `lib/seo.ts` (leading slash, single trailing slash for non-root). Served URLs use `trailingSlash: true`, so canonicals match the served URL and avoid redirect chains.

### Internal linking

- **From homepage:** Tools, ingredients, popular converters (e.g. cups-to-grams/flour, cups-to-ml, oz-to-grams), about copy.
- **From tools hub:** Each converter type links to its hub; each hub lists all ingredients (links to `/[converter]/[ingredient]`).
- **From ingredients hub:** One link per ingredient to `/ingredients/[ingredient]`.
- **From converter page:** “Related Conversions” (same ingredient other converters + same converter other ingredients), “Popular Ingredients,” link to ingredient guide; breadcrumbs Home → Tools → current.
- **From ingredient page:** Related converter tools, popular ingredients, breadcrumbs Home → Ingredients → current.
- **From /q/ page:** Link to main converter and to ingredient guide, plus Related Conversions and Popular Ingredients.
- **Footer:** Tools, Ingredients, Guides, Privacy, Terms, Contact; plus Popular Ingredients component.
- **Nav:** Home, Tools, Ingredients, Guides, About.

---

## 5. Content Quality Check

| Aspect | Finding |
|--------|--------|
| **Unique text** | Converter×ingredient pages use **ingredient- and converter-specific** “Why density matters,” “Common mistakes,” and “Measurement tips” (flour/sugar/dairy/oil/liquid/generic + converter type). FAQs are generated with density and amounts. Intro and body paragraphs inject ingredient name and density. |
| **Explanatory content** | Multiple H2 sections (understanding conversions, why density matters, common mistakes, measurement tips), EEAT section (“How we source our data”), and practical tips. |
| **Conversion tables** | Present and useful; they are **supplemented** by prose and FAQs, not the only content. |
| **Templates** | Same structural template across programmatic pages, but **variable content** (ingredient name, density, category-based paragraphs, FAQ answers). Ingredient hub has a limited content map (custom copy for ~20 ingredients); the rest use one generic sentence. |

**Recommendation:** Expand `generateIngredientContent()` (and/or add more sections) for more ingredients to reduce reliance on the single fallback line and strengthen E-E-A-T for ingredient hub pages.

---

## 6. Internal Linking

### Hub coverage

- **Homepage:** Links to /tools, /ingredients, and sample converter/ingredient/pure pages.
- **Tools hub (`/tools`):** Lists all 3 converter types with “View all ingredients” to each converter hub; lists all pure pages. Every converter×ingredient URL is reachable: Home → Tools → [converter] → [ingredient].
- **Ingredients hub (`/ingredients`):** Links to every `/ingredients/[ingredient]`.

### Click depth

- **Home → any converter×ingredient:** 3 clicks (Home → Tools → [converter] → [ingredient]).
- **Home → ingredient guide:** 2 clicks (Home → Ingredients → [ingredient]).
- **Home → /q/ page:** Not linked directly from hubs; reachable via search, sitemap, or from related links on converter/ingredient pages. Adding a subset of “Popular queries” on tools or home could improve discoverability; depth from home would still be ≤3 if linked from a hub.
- **Pure pages:** 2 clicks from home (Tools → pure page).

Conclusion: **Every main page type is reachable within 3 clicks** from the homepage via hubs. Only `/q/` long-tail pages are not linked from a central hub (they are linked from converter/ingredient pages and sitemap).

---

## 7. Performance

### Configuration

- **Static export:** `output: 'export'` — no server at runtime; all HTML pre-rendered.
- **Compression:** `compress: true`.
- **Minification:** `swcMinify: true` (default in Next 14).
- **Images:** `unoptimized: true` (typical for static export unless using a static image pipeline). Single shared `/og.png` for social.
- **Fonts:** Inter via `next/font` with `display: 'swap'`, preload, fallback — good for LCP/CLS.
- **Dynamic imports:** Converter, FAQ, RelatedConversions (and Search on layout) use `dynamic()` with `ssr: true` for above-the-fold SEO content, so main content is in initial HTML while still code-split.

### Page weight and scripts

- No heavy client runtime beyond React/Next; no large third-party SDKs observed in the app tree. Ads use `AdSlot` (placeholder); actual ad scripts would add weight and can affect LCP/INP if loaded eagerly.
- **Core Web Vitals:** Font swap and preload, minimal blocking scripts, static HTML favor LCP and FID/INP. Largest content is likely H1 + first paragraph or converter/table; ensuring hero text and key content are in the first viewport and not delayed by dynamic imports is already handled (SSR for main content). Monitor LCP (image/font), CLS (layout stability), INP (event handlers).

### Recommendations

- Ensure `/og.png` is optimized (e.g. WebP, reasonable dimensions).
- If ad scripts are added, load them after main content (e.g. lazy or requestIdleCallback) to limit impact on LCP/INP.
- Consider adding `priority` to any above-the-fold image if you introduce more images.

---

## 8. Risk Analysis

### Thin content

- **Risk: Low–medium.** Converter×ingredient and /q/ pages have substantial, differentiated text and FAQs. Ingredient hub pages are lighter for ingredients that only use the generic density sentence; expanding the content map would lower this risk further.

### Doorway pages

- **Risk: Low.** Pages are not gateways that merely send users elsewhere; each URL serves a real tool (calculator + table) plus explanatory content and internal links. URLs are topic-specific (ingredient + conversion type or query), not arbitrary keyword variants.

### Programmatic spam

- **Risk: Low.** Content is **varied by ingredient and converter type** (density, category-based advice, FAQs). No scraping or low-quality auto-spin. Data source (density table) is coherent and useful. Structure is consistent but content is not duplicate across URLs.

### Summary of risks

- **Biggest residual risk:** Ingredient hub pages with only the generic one-line intro; improving those reduces thin-content and E-E-A-T concerns.
- **Good practices:** Whitelist-only URLs, unique meta and H1s, canonical + sitemap alignment, structured data, and clear internal linking all support safe scaling.

---

## 9. Growth Potential

### Maximum page count (current architecture)

- **Current:** ~3,226 pages (246 ingredients, 3 converters, 5+4 query shapes for /q/).
- **To reach ~10k pages** without new route types:
  - **Option A:** Increase ingredients (e.g. ~700–750) → 3×750 + 750 + 9×750 ≈ 9,750 + static/hubs ≈ **~10k**.
  - **Option B:** Add more long-tail values (e.g. more GRAM_VALUES / CUP_VALUES) → more /q/ pages per ingredient.
  - **Option C:** Add converter types (e.g. tsp-to-grams) → more converter×ingredient pages.

Scaling is **additive and predictable**; all pages remain whitelist-based and follow the same content pattern (differentiated text + table + FAQs + links).

### Long-tail keyword coverage

- **Converter×ingredient:** Targets “[unit] to [unit] for [ingredient]” and “[ingredient] conversion.”
- **/q/ pages:** Target exact queries like “200 grams flour to cups,” “2 cups sugar to grams.” Strong for long-tail and featured-snippet style answers (prominent result + table + FAQs).
- **Ingredient hub:** Supports “[ingredient] density,” “[ingredient] cups to grams,” “[ingredient] cooking guide.”

Adding more ingredients and/or query values directly increases long-tail coverage.

### Scaling to 10k+ safely

- **Architecture:** Single sitemap with ~10k entries is acceptable; if you grow further, consider sitemap index + multiple sitemaps (Next.js allows returning multiple sitemaps or splitting by section).
- **Build time:** Static generation of 10k pages may increase build duration; monitor and optimize (e.g. parallelization, incremental builds) if needed.
- **Content quality:** Keeping the same level of differentiation (ingredient/converter/query-specific text and FAQs) as you add ingredients or query types will help avoid thin-content or spam signals. The current pattern (category-based “why density matters,” mistakes, tips, 8 FAQs) is replicable for new ingredients.

---

## 10. Summary

### SEO health score: **7.5 / 10**

### Biggest strengths

1. **Consistent technical SEO:** Unique titles and meta descriptions, canonicals with trailing slash aligned to sitemap and config, OpenGraph/Twitter, and JSON-LD (Breadcrumb, FAQ, Article, WebSite) across key pages.
2. **Differentiated programmatic content:** Converter×ingredient and /q/ pages use ingredient- and converter-specific prose and FAQs, not a single repeated block.
3. **Clear structure:** Whitelist-only routes, hub pages (tools, ingredients), and related links give every important URL a path from home within 3 clicks and support crawl efficiency.
4. **E-E-A-T signals:** EEAT section, Article schema, and “How we source our data” support trust and expertise.
5. **Static export + performance-conscious setup:** Font swap, compression, code-splitting with SSR for main content support Core Web Vitals and indexing.

### Biggest risks

1. **Ingredient hub pages:** Many ingredients rely on one generic sentence; expanding the content map (and optionally more sections) would reduce thin-content risk and strengthen E-E-A-T.
2. **/q/ discoverability:** Long-tail pages are in the sitemap and linked from converter/ingredient pages but not from tools/home; consider a “Popular conversions” or query list on a hub if you want to push more crawl and discovery to /q/.
3. **Homepage copy:** “Over 20 common ingredients” is outdated (you have ~246); updating this avoids credibility issues.

### Recommended improvements

1. **Content:** Expand `generateIngredientContent()` (and/or add “Why density matters” / tips per ingredient) so most or all ingredient hub pages have at least a short, ingredient-specific paragraph.
2. **Copy:** Update homepage and any other “over 20 ingredients” text to reflect current scale (e.g. “200+ ingredients”).
3. **Internal links:** Add a small “Popular conversions” or “Common queries” block on /tools or home linking to selected /q/ URLs (e.g. “200g flour to cups,” “1 cup sugar to grams”) to improve crawl and UX for long-tail.
4. **Sitemap at scale:** If you approach or exceed ~50k URLs, plan for a sitemap index and multiple sitemap files.
5. **Monitoring:** Use Search Console (index coverage, core pages, manual actions) and a Core Web Vitals report to track health as you add ingredients and pages.

---

*End of report. All findings are based on static analysis of the repository (app, lib, components, config) and may need validation against the live site (e.g. canonical and sitemap URLs, actual page weight, and CWV).*
