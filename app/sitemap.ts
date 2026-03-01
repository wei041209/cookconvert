import { MetadataRoute } from 'next';
import { INGREDIENTS, INGREDIENT_CONVERTERS, PURE_PAGES } from '@/lib/registry';
import { buildCanonical } from '@/lib/seo';

// Use a single build-time timestamp for deterministic sitemap generation
const buildTime = new Date(process.env.NEXT_PUBLIC_BUILD_TIME ?? Date.now());

/** Path segment without leading slash (for building pathnames) */
function stripLeadingSlash(s: string): string {
  return s.replace(/^\/+/, '');
}

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: MetadataRoute.Sitemap = [
    { url: buildCanonical('/'), lastModified: buildTime, changeFrequency: 'weekly', priority: 1 },
    { url: buildCanonical('/tools'), lastModified: buildTime, changeFrequency: 'weekly', priority: 0.9 },
    { url: buildCanonical('/ingredients'), lastModified: buildTime, changeFrequency: 'weekly', priority: 0.9 },
    { url: buildCanonical('/about'), lastModified: buildTime, changeFrequency: 'monthly', priority: 0.7 },
    { url: buildCanonical('/privacy'), lastModified: buildTime, changeFrequency: 'yearly', priority: 0.3 },
    { url: buildCanonical('/terms'), lastModified: buildTime, changeFrequency: 'yearly', priority: 0.3 },
    { url: buildCanonical('/contact'), lastModified: buildTime, changeFrequency: 'monthly', priority: 0.5 },
    { url: buildCanonical('/guides'), lastModified: buildTime, changeFrequency: 'monthly', priority: 0.8 },
  ];

  const guideSlugs = [
    'grams-vs-cups-complete-guide',
    'why-baking-needs-precision',
    'how-to-measure-flour-correctly',
    'common-measurement-mistakes-in-baking',
    'kitchen-conversion-chart-guide',
  ];
  guideSlugs.forEach((slug) => {
    routes.push({ url: buildCanonical(`/guides/${slug}`), lastModified: buildTime, changeFrequency: 'monthly', priority: 0.8 });
  });

  PURE_PAGES.forEach((page) => {
    routes.push({ url: buildCanonical('/' + stripLeadingSlash(page)), lastModified: buildTime, changeFrequency: 'monthly', priority: 0.8 });
  });

  INGREDIENT_CONVERTERS.forEach((converter) => {
    INGREDIENTS.forEach((ingredient) => {
      routes.push({ url: buildCanonical(`/${converter}/${ingredient}`), lastModified: buildTime, changeFrequency: 'monthly', priority: 0.8 });
    });
  });

  INGREDIENTS.forEach((ingredient) => {
    routes.push({ url: buildCanonical(`/ingredients/${ingredient}`), lastModified: buildTime, changeFrequency: 'monthly', priority: 0.8 });
  });

  const GRAM_VALUES = [50, 100, 200, 250, 500];
  GRAM_VALUES.forEach((grams) => {
    INGREDIENTS.forEach((ingredient) => {
      routes.push({ url: buildCanonical(`/q/${grams}-grams-${ingredient}-to-cups`), lastModified: buildTime, changeFrequency: 'monthly', priority: 0.7 });
    });
  });

  const CUP_VALUES = [0.5, 1, 2, 3];
  CUP_VALUES.forEach((cups) => {
    INGREDIENTS.forEach((ingredient) => {
      routes.push({ url: buildCanonical(`/q/${cups}-cups-${ingredient}-to-grams`), lastModified: buildTime, changeFrequency: 'monthly', priority: 0.7 });
    });
  });

  return routes;
}
