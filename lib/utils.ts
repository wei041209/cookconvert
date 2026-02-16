import { INGREDIENTS, INGREDIENT_CONVERTERS, PURE_PAGES, INGREDIENT_NAMES } from './registry';
import { getSiteUrl } from './site';
import { normalizePathname } from './path';

// Popular ingredients in priority order for related tools
const POPULAR_INGREDIENTS: string[] = [
  'flour',
  'sugar',
  'butter',
  'milk',
  'water',
  'honey',
  'olive-oil',
  'rice',
];

/**
 * Strip leading slashes from a string
 */
function stripLeadingSlash(s: string): string {
  return s.replace(/^\/+/, '');
}

/**
 * Convert a slug string to a title (e.g., "cups-to-grams" -> "Cups to Grams")
 * Keeps "to" lowercase for better readability
 */
function slugToTitle(slug: string): string {
  return slug.split('-').map(w => {
    if (w.toLowerCase() === 'to') {
      return 'to';
    }
    return w.charAt(0).toUpperCase() + w.slice(1);
  }).join(' ');
}

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${normalizePathname(item.url)}`,
    })),
  };
}

export function generateFAQJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Article schema JSON-LD for E-E-A-T signals
 */
export function generateArticleJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
  authorName = 'CookConvert Team',
  publisherName = 'CookConvert',
  publisherLogo = '/og.png',
}: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  publisherName?: string;
  publisherLogo?: string;
}) {
  const siteUrl = getSiteUrl();
  const normalizedUrl = `${siteUrl}${normalizePathname(url)}`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    url: normalizedUrl,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: authorName,
      url: siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: publisherName,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}${publisherLogo}`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': normalizedUrl,
    },
  };
}

/**
 * Get related conversions for a conversion page
 * Returns 6-8 related links with SEO-friendly anchor text
 */
export function getRelatedConversions(
  currentPath: string,
  ingredient?: string
): { title: string; href: string }[] {
  const conversions: { title: string; href: string }[] = [];
  const normalizedCurrentPath = normalizePathname(currentPath);

  if (ingredient) {
    const ingredientName = INGREDIENT_NAMES[ingredient];
    
    // First: Same ingredient, other converter types (max 2 items)
    INGREDIENT_CONVERTERS.forEach((converter) => {
      if (conversions.length >= 2) return;
      
      const path = normalizePathname(`/${converter}/${ingredient}`);
      if (path !== normalizedCurrentPath) {
        const converterTitle = slugToTitle(converter);
        // SEO-friendly format: "IngredientName ConverterType" (e.g., "Sour Cream Cups to Grams")
        conversions.push({
          title: `${ingredientName} ${converterTitle}`,
          href: path,
        });
      }
    });

    // Then: Same converter type, popular ingredients (fill remaining slots up to 8)
    const pathParts = normalizedCurrentPath.split('/').filter(Boolean);
    const converterType = pathParts[0];
    
    if (converterType) {
      const converterTitle = slugToTitle(converterType);
      
      // Add popular ingredients first
      POPULAR_INGREDIENTS.forEach((ing) => {
        if (conversions.length >= 8) return;
        if (ing === ingredient) return;
        
        const path = normalizePathname(`/${converterType}/${ing}`);
        conversions.push({
          title: `${INGREDIENT_NAMES[ing]} ${converterTitle}`,
          href: path,
        });
      });

      // If still not enough, continue with remaining ingredients
      if (conversions.length < 8) {
        INGREDIENTS.forEach((ing) => {
          if (conversions.length >= 8) return;
          if (ing === ingredient) return;
          if (POPULAR_INGREDIENTS.includes(ing)) return;
          
          const path = normalizePathname(`/${converterType}/${ing}`);
          conversions.push({
            title: `${INGREDIENT_NAMES[ing]} ${converterTitle}`,
            href: path,
          });
        });
      }
    }
  } else {
    // Pure math pages - show other pure math pages
    PURE_PAGES.forEach((page) => {
      if (conversions.length >= 8) return;
      
      const slug = stripLeadingSlash(page);
      const path = normalizePathname(`/${slug}`);
      if (path !== normalizedCurrentPath) {
        conversions.push({
          title: slugToTitle(slug),
          href: path,
        });
      }
    });
  }

  return conversions.slice(0, 8);
}

/**
 * Legacy function - kept for backward compatibility
 * @deprecated Use getRelatedConversions instead for better SEO anchor text
 */
export function getRelatedTools(
  currentPath: string,
  ingredient?: string
): { title: string; href: string }[] {
  const tools: { title: string; href: string }[] = [];
  const normalizedCurrentPath = normalizePathname(currentPath);

  if (ingredient) {
    // First: Same ingredient, other converter types (max 2 items)
    INGREDIENT_CONVERTERS.forEach((converter) => {
      if (tools.length >= 2) return; // Stop after 2 items
      
      const path = normalizePathname(`/${converter}/${ingredient}`);
      if (path !== normalizedCurrentPath) {
        tools.push({
          title: `${slugToTitle(converter)} - ${INGREDIENT_NAMES[ingredient]}`,
          href: path,
        });
      }
    });

    // Then: Same converter type, popular ingredients (fill remaining slots up to 8)
    const pathParts = normalizedCurrentPath.split('/').filter(Boolean);
    const converterType = pathParts[0];
    
    if (converterType) {
      // Add popular ingredients first
      POPULAR_INGREDIENTS.forEach((ing) => {
        if (tools.length >= 8) return; // Stop at 8 items
        if (ing === ingredient) return; // Skip current ingredient
        
        const path = normalizePathname(`/${converterType}/${ing}`);
        tools.push({
          title: `${slugToTitle(converterType)} - ${INGREDIENT_NAMES[ing]}`,
          href: path,
        });
      });

      // If still not enough, continue with remaining ingredients
      if (tools.length < 8) {
        INGREDIENTS.forEach((ing) => {
          if (tools.length >= 8) return; // Stop at 8 items
          if (ing === ingredient) return; // Skip current ingredient
          
          // Skip if already added from popular list
          if (POPULAR_INGREDIENTS.includes(ing)) return;
          
          const path = normalizePathname(`/${converterType}/${ing}`);
          tools.push({
            title: `${slugToTitle(converterType)} - ${INGREDIENT_NAMES[ing]}`,
            href: path,
          });
        });
      }
    }
  } else {
    // Pure math pages - show other pure math pages
    PURE_PAGES.forEach((page) => {
      if (tools.length >= 8) return; // Stop at 8 items
      
      // Strip leading slash to handle entries with or without it
      const slug = stripLeadingSlash(page);
      const path = normalizePathname(`/${slug}`);
      if (path !== normalizedCurrentPath) {
        tools.push({
          title: slugToTitle(slug),
          href: path,
        });
      }
    });
  }

  return tools.slice(0, 8);
}

