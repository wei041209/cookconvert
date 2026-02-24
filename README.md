# CookConvert

A production-ready, SEO-first cooking measurement converter website built with Next.js 14.

## Features

- **60 Ingredient Converter Pages**: Convert cups to grams, grams to cups, and tablespoons to grams for 20 different ingredients
- **6 Pure Math Converter Pages**: Convert between cups/ml, oz/grams, and tbsp/tsp to ml
- **20 Ingredient Knowledge Pages**: Learn about ingredients, their densities, and conversion tips
- **SEO Optimized**: Each page includes unique titles, meta descriptions, JSON-LD structured data, and comprehensive content
- **Mobile-First Design**: Responsive, clean UI that works perfectly on all devices
- **Instant Conversions**: All calculations happen client-side with no page reloads
- **Privacy-Focused**: No data collection, all conversions happen in your browser

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Static Site Generation (SSG)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

This will generate a static export in the `out` directory.

### Production

```bash
npm start
```

### Deployment (Cloudflare Pages)

This project is configured for static export and deployed to Cloudflare Pages.

**Environment Variables:**
- Set `NEXT_PUBLIC_SITE_URL=https://cookconvertapp.com` in Cloudflare Pages environment variables (Production environment)
- This ensures canonical URLs, sitemap, and structured data use the correct domain

**Redirects:**
- The `public/_redirects` file handles domain redirects:
  - `https://cookconvert.pages.dev/*` → `https://cookconvertapp.com/:splat` (301)
  - `https://www.cookconvertapp.com/*` → `https://cookconvertapp.com/:splat` (301)
- This file is automatically copied to `out/_redirects` during build
- Cloudflare Pages will process these redirects automatically

**Post-Deployment Verification Checklist:**
- [ ] Visit `https://cookconvert.pages.dev/anything` → Should redirect 301 to `https://cookconvertapp.com/anything`
- [ ] Visit `https://www.cookconvertapp.com/anything` → Should redirect 301 to `https://cookconvertapp.com/anything`
- [ ] Visit `https://cookconvertapp.com/sitemap.xml` → Verify all `<loc>` tags use `cookconvertapp.com` domain
- [ ] View page source of any page → Verify `<link rel="canonical">` uses `cookconvertapp.com` domain
- [ ] Check JSON-LD structured data → Verify all `url` fields use `cookconvertapp.com` domain

## Project Structure

```
/app
  /[converter]/[ingredient]  # Dynamic ingredient converter pages
  /ingredients/[ingredient]  # Ingredient knowledge pages
  /cups-to-ml               # Pure math converter pages
  /ml-to-cups
  /oz-to-grams
  /grams-to-oz
  /tbsp-to-ml
  /tsp-to-ml
  /tools                    # Tools listing page
  /ingredients              # Ingredients listing page
  /about                    # About page
  /privacy                  # Privacy policy
  /terms                    # Terms of service
  /contact                  # Contact page
  sitemap.ts                # Dynamic sitemap generation
  robots.ts                 # Robots.txt generation
/components
  AdSlot.tsx                # Ad placeholder component
  Converter.tsx             # Main converter component
  ConversionTable.tsx       # Conversion table component
  FAQ.tsx                   # FAQ component
  RelatedTools.tsx          # Related tools component
/lib
  registry.ts               # Whitelist arrays for all routes
  conversion.ts             # Conversion functions
  utils.ts                  # Utility functions (JSON-LD, etc.)
```

## Page Count

- **60** Ingredient converter pages (20 ingredients × 3 converter types)
- **20** Ingredient knowledge pages
- **6** Pure math converter pages
- **7** Core pages (home, tools, ingredients, about, privacy, terms, contact)
- **Total: 93 pages**

## SEO Features

- Unique title and meta description for each page
- JSON-LD structured data (BreadcrumbList, FAQPage, WebSite)
- Comprehensive content (400-600 words per page)
- Internal linking (8+ related pages per page)
- Static conversion tables
- FAQ sections
- Sitemap.xml generation
- Robots.txt

## Ingredients

The following 20 ingredients are supported:

- Flour
- Sugar
- Brown Sugar
- Butter
- Milk
- Water
- Honey
- Olive Oil
- Rice
- Salt
- Baking Powder
- Cocoa Powder
- Oats
- Yogurt
- Cream
- Chopped Onion
- Shredded Cheese
- Breadcrumbs
- Peanut Butter
- Jam

## License

MIT



