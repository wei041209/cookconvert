import { MetadataRoute } from 'next';
import { INGREDIENTS, INGREDIENT_CONVERTERS, PURE_PAGES } from '@/lib/registry';
import { getSiteUrl } from '@/lib/site';

// Use a single build-time timestamp for deterministic sitemap generation
const buildTime = new Date(process.env.NEXT_PUBLIC_BUILD_TIME ?? Date.now());

/**
 * Normalize a path segment
 * - trims whitespace
 * - ensures starts without leading "/"
 * - removes trailing "/" (unless empty)
 */
function normalizePath(input: string): string {
  let normalized = input.trim();
  
  // Remove leading "/"
  normalized = normalized.replace(/^\/+/, '');
  
  // Remove trailing "/" (unless empty)
  if (normalized !== '') {
    normalized = normalized.replace(/\/+$/, '');
  }
  
  return normalized;
}

/**
 * Join base URL with path, avoiding double slashes and trailing slashes
 * - baseUrl assumed no trailing slash, but be defensive
 * - return `${baseUrl}/${normalizedPath}` or baseUrl if normalizedPath is empty
 */
function joinUrl(baseUrl: string, path: string): string {
  // Defensive: ensure baseUrl has no trailing slash
  const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
  const normalizedPath = normalizePath(path);
  
  // If path is empty, return just baseUrl
  if (normalizedPath === '') {
    return cleanBaseUrl;
  }
  
  return `${cleanBaseUrl}/${normalizedPath}`;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  
  const routes: MetadataRoute.Sitemap = [
    {
      url: joinUrl(baseUrl, ''),
      lastModified: buildTime,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: joinUrl(baseUrl, 'tools'),
      lastModified: buildTime,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: joinUrl(baseUrl, 'ingredients'),
      lastModified: buildTime,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: joinUrl(baseUrl, 'about'),
      lastModified: buildTime,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: joinUrl(baseUrl, 'privacy'),
      lastModified: buildTime,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: joinUrl(baseUrl, 'terms'),
      lastModified: buildTime,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: joinUrl(baseUrl, 'contact'),
      lastModified: buildTime,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];
  
  // Add pure math converter pages
  PURE_PAGES.forEach((page) => {
    routes.push({
      url: joinUrl(baseUrl, page),
      lastModified: buildTime,
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  });
  
  // Add ingredient converter pages
  INGREDIENT_CONVERTERS.forEach((converter) => {
    INGREDIENTS.forEach((ingredient) => {
      routes.push({
        url: joinUrl(baseUrl, `${converter}/${ingredient}`),
        lastModified: buildTime,
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    });
  });
  
  // Add ingredient knowledge pages
  INGREDIENTS.forEach((ingredient) => {
    routes.push({
      url: joinUrl(baseUrl, `ingredients/${ingredient}`),
      lastModified: buildTime,
      changeFrequency: 'monthly',
      priority: 0.8,
    });
  });
  
  return routes;
}
