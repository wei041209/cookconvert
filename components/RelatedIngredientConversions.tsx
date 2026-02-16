import Link from 'next/link';
import { INGREDIENT_NAMES, INGREDIENT_CONVERTERS } from '@/lib/registry';
import { normalizePathname } from '@/lib/path';

interface RelatedIngredientConversionsProps {
  ingredient: string;
}

/**
 * Related Conversions section for ingredient pages
 * Links to all converter types for the ingredient
 */
export default function RelatedIngredientConversions({ 
  ingredient 
}: RelatedIngredientConversionsProps) {
  const ingredientName = INGREDIENT_NAMES[ingredient];

  // Map converter slugs to display names and descriptions
  const converterInfo: Record<string, { title: string; description: string }> = {
    'cups-to-grams': {
      title: 'Cups to Grams',
      description: `Convert cups to grams for ${ingredientName}`,
    },
    'grams-to-cups': {
      title: 'Grams to Cups',
      description: `Convert grams to cups for ${ingredientName}`,
    },
    'tbsp-to-grams': {
      title: 'Tablespoons to Grams',
      description: `Convert tablespoons to grams for ${ingredientName}`,
    },
  };

  return (
    <section className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Conversions for {ingredientName}</h2>
      <p className="text-gray-700 mb-4">
        Use these conversion tools to convert {ingredientName} between different measurement units. 
        Each converter uses the precise density of {ingredientName} for accurate results.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {INGREDIENT_CONVERTERS.map((converter) => {
          const info = converterInfo[converter];
          const path = normalizePathname(`/${converter}/${ingredient}`);
          
          return (
            <Link
              key={converter}
              href={path}
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <div className="font-semibold text-gray-900 mb-1">
                {ingredientName} {info.title}
              </div>
              <div className="text-sm text-gray-600">
                {info.description}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

