import Link from 'next/link';
import { INGREDIENT_NAMES } from '@/lib/registry';
import { normalizePathname } from '@/lib/path';

interface PopularIngredientsProps {
  excludeIngredient?: string;
  maxItems?: number;
  variant?: 'default' | 'footer';
}

/**
 * Popular Ingredients component for internal linking
 * SEO-optimized with keyword-rich anchor text
 */
export default function PopularIngredients({ 
  excludeIngredient,
  maxItems = 8,
  variant = 'default',
}: PopularIngredientsProps) {
  const popularIngredients = [
    'flour',
    'sugar',
    'butter',
    'milk',
    'water',
    'honey',
    'olive-oil',
    'rice',
    'salt',
    'baking-powder',
    'cocoa-powder',
    'oats',
    'yogurt',
    'cream',
    'peanut-butter',
    'jam',
  ];

  const ingredientsToShow = popularIngredients
    .filter(ing => ing !== excludeIngredient)
    .slice(0, maxItems);

  if (ingredientsToShow.length === 0) {
    return null;
  }

  if (variant === 'footer') {
    return (
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Popular Ingredients</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
          {ingredientsToShow.map((ingredient) => {
            const ingredientName = INGREDIENT_NAMES[ingredient];
            const ingredientPath = normalizePathname(`/ingredients/${ingredient}`);
            
            return (
              <Link
                key={ingredient}
                href={ingredientPath}
                className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
                title={`${ingredientName} - Cooking Ingredient Guide`}
              >
                {ingredientName}
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular Ingredients</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {ingredientsToShow.map((ingredient) => {
          const ingredientName = INGREDIENT_NAMES[ingredient];
          const ingredientPath = normalizePathname(`/ingredients/${ingredient}`);
          
          return (
            <Link
              key={ingredient}
              href={ingredientPath}
              className="p-3 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors text-sm"
            >
              <span className="font-medium text-gray-900 hover:text-primary-600">
                {ingredientName}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

