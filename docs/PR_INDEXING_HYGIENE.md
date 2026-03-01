# PR: Indexing Hygiene (SEO)

Minimal, production-safe changes to reduce GSC Redirect/Not Indexed noise and prevent invalid dynamic URLs from emitting indexable signals.

## Changes

- **A)** Invalid dynamic slugs (`/ingredients/[ingredient]`, `/q/[query]`) now call `notFound()` in both `generateMetadata` and page render → 404, no indexable metadata.
- **B)** Canonical URLs aligned with `trailingSlash: true`: root stays `/`, non-root paths end with `/`; query/hash stripped.
- **C)** Sitemap reuses `buildCanonical()` so every `<loc>` matches canonical exactly.
- **D)** `public/_redirects`: added http→https rules for cookconvertapp.com and www. If Cloudflare Pages does not support scheme-based rules in `_redirects`, enable **Always Use HTTPS** in Cloudflare Dashboard → SSL/TLS → Edge Certificates.

## Verification checklist

- [ ] Build/export succeeds: `npm run build`
- [ ] **Canonical checks** (view page source or inspect Next metadata):
  - `/`, `/tools/`, `/ingredients/`, `/guides/`, `/cups-to-grams/flour/`, `/ingredients/flour/`, `/q/100-grams-flour-to-cups/`
  - Canonical ends with `/` for non-root; root canonical has no trailing path.
  - Visiting the canonical URL returns 200 (no redirect chain).
- [ ] **Sitemap:** Open `/sitemap.xml` and spot-check: the above URLs appear exactly as in canonicals (same trailing slash).
- [ ] **Invalid URLs return 404:**
  - `/ingredients/not-a-real-ingredient/` → 404
  - `/q/not-a-valid-query/` → 404
  - No indexable metadata (layout fallback) for these.

## Commits

1. SEO: 404 on invalid ingredient/query params  
2. SEO: align canonical with trailingSlash  
3. SEO: sitemap uses canonical builder  
4. SEO: http→https normalization (or docs note)
