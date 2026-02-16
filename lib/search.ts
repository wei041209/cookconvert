import { INGREDIENTS, INGREDIENT_CONVERTERS, PURE_PAGES, INGREDIENT_NAMES } from './registry';
import { normalizePathname } from './path';

export interface SearchResult {
  title: string;
  href: string;
  type: 'ingredient-converter' | 'pure-converter' | 'ingredient-page';
  description?: string;
}

/**
 * Build a searchable index of all pages
 * Optimized for fast client-side searching
 */
export function buildSearchIndex(): SearchResult[] {
  const index: SearchResult[] = [];

  // Helper to convert slug to title
  function slugToTitle(slug: string): string {
    return slug.split('-').map(w => {
      if (w.toLowerCase() === 'to') {
        return 'to';
      }
      return w.charAt(0).toUpperCase() + w.slice(1);
    }).join(' ');
  }

  // Add ingredient converter pages
  INGREDIENT_CONVERTERS.forEach((converter) => {
    const converterTitle = slugToTitle(converter);
    INGREDIENTS.forEach((ingredient) => {
      const ingredientName = INGREDIENT_NAMES[ingredient];
      const path = normalizePathname(`/${converter}/${ingredient}`);
      
      index.push({
        title: `${ingredientName} ${converterTitle}`,
        href: path,
        type: 'ingredient-converter',
        description: `Convert ${converterTitle.toLowerCase()} for ${ingredientName}`,
      });
    });
  });

  // Add pure math converter pages
  PURE_PAGES.forEach((page) => {
    const slug = page.replace(/^\//, '');
    const title = slugToTitle(slug);
    const path = normalizePathname(`/${slug}`);
    
    index.push({
      title: title,
      href: path,
      type: 'pure-converter',
      description: `Convert ${title.toLowerCase()}`,
    });
  });

  // Add ingredient knowledge pages
  INGREDIENTS.forEach((ingredient) => {
    const ingredientName = INGREDIENT_NAMES[ingredient];
    const path = normalizePathname(`/ingredients/${ingredient}`);
    
    index.push({
      title: `${ingredientName} - Ingredient Guide`,
      href: path,
      type: 'ingredient-page',
      description: `Learn about ${ingredientName} and its conversions`,
    });
  });

  return index;
}

/**
 * Search the index with fuzzy matching
 * Returns results sorted by relevance
 */
export function searchIndex(query: string, index: SearchResult[]): SearchResult[] {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  const queryWords = normalizedQuery.split(/\s+/).filter(Boolean);

  // Score each result
  const scoredResults = index.map((result) => {
    const normalizedTitle = result.title.toLowerCase();
    const normalizedDescription = result.description?.toLowerCase() || '';
    const searchableText = `${normalizedTitle} ${normalizedDescription}`;

    let score = 0;

    // Exact match gets highest score
    if (normalizedTitle === normalizedQuery) {
      score += 1000;
    } else if (normalizedTitle.startsWith(normalizedQuery)) {
      score += 500;
    } else if (normalizedTitle.includes(normalizedQuery)) {
      score += 200;
    }

    // Word-by-word matching
    queryWords.forEach((word) => {
      if (normalizedTitle.includes(word)) {
        score += 50;
      }
      if (normalizedDescription.includes(word)) {
        score += 10;
      }
    });

    // Boost ingredient converter pages
    if (result.type === 'ingredient-converter') {
      score += 5;
    }

    return { result, score };
  });

  // Filter out zero-score results and sort by score
  return scoredResults
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10) // Limit to top 10 results
    .map(({ result }) => result);
}

