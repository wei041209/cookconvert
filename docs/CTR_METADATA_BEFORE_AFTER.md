# CTR Metadata Upgrade — Before/After Examples

Metadata-only changes (titles and meta descriptions). URLs and visible page content unchanged.

---

## 1. `/cups-to-grams/flour/` (Converter + Ingredient)

| | Before | After |
|---|--------|--------|
| **Title** | Flour: Cups to Grams Converter - CookConvert | Cups to Grams for Flour — Accurate Conversion Chart & Free Calculator *(trimmed to 65 chars if needed)* |
| **Meta description** | Convert cups to grams for Flour. Free, instant cooking measurement converter with accurate density values. Free cooking measurement converter for bakers and chefs. | Convert cups to grams for Flour. Accurate density-based conversions for baking and cooking. Instant conversion, accurate density values, printable chart, and common kitchen units. Updated 2026. *(truncated to 155 chars at word boundary if needed)* |

*Note: Visible H1 on the page remains "Flour: Cups to Grams Converter".*

---

## 2. `/cups-to-grams/` (Pure converter)

| | Before | After |
|---|--------|--------|
| **Title** | Cups to Grams Converter - CookConvert | Cups to Grams — Accurate Conversion Chart & Free Calculator *(trimmed to 65 chars if needed)* |
| **Meta description** | Convert cups to grams. Free cooking converter. Free cooking measurement converter for bakers and chefs. | Convert cups to grams for any ingredient. Accurate density-based conversions for baking and cooking. Instant conversion, accurate density values, printable chart, and common kitchen units. Updated 2026. *(truncated to 155 chars if needed)* |

---

## 3. `/q/100-grams-flour-to-cups/` (Query page)

| | Before | After |
|---|--------|--------|
| **Title** | 100g Flour to Cups - Conversion Calculator - CookConvert | 100g Flour to Cups — Exact Result + Conversion Chart *(trimmed to 65 chars if needed)* |
| **Meta description** | Convert 100g of Flour to 0.83 cups. Free, instant conversion calculator with accurate density values. Perfect for baking and cooking recipes. | 100g Flour = 0.83 cups. Accurate conversion using Flour's density. For baking and cooking. Instant conversion, accurate density values, printable chart, and common kitchen units. Updated 2026. *(truncated to 155 chars if needed)* |

---

## 4. `/ingredients/flour/` (Ingredient guide)

| | Before | After |
|---|--------|--------|
| **Title** | Flour - Cooking Ingredient Guide - CookConvert | Flour — Density, Conversion Chart & Cooking Tips *(trimmed to 65 chars if needed)* |
| **Meta description** | Learn about Flour, its density (120 grams per cup), and conversion tips. Free cooking ingredient guide with conversion tools | Flour: density 120 g/cup, cups-to-grams table, and measuring tips for baking and cooking. Instant conversion, accurate density values, printable chart, and common kitchen units. Updated 2026. *(truncated to 155 chars if needed)* |

---

## Helpers in `lib/seo.ts`

- **`trimTitle(title, maxLength?)`** — Trims to ~65 characters (default) at word boundary; no mid-word cut. Used inside `buildTitle()` so all metadata titles stay SERP-friendly.
- **`buildDescription({ description })`** — Appends benefit suffix (*Instant conversion, accurate density values, printable chart, and common kitchen units. Updated 2026.*) when not present, then truncates to 155 chars at word boundary.
