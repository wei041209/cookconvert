import type { Metadata } from 'next';
import Link from 'next/link';
import { INGREDIENTS, INGREDIENT_NAMES } from '@/lib/registry';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  pageTitle: 'Cooking Ingredients Guide',
  description: 'Browse cooking ingredients and learn about their densities, conversion tips, and measurement guides',
  pathname: '/ingredients',
});

export default function IngredientsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Cooking Ingredients</h1>
      <p className="text-xl text-gray-600 mb-12">
        Browse our ingredient guides to learn about densities, conversions, and measurement tips.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {INGREDIENTS.map((ingredient) => (
          <Link
            key={ingredient}
            href={`/ingredients/${ingredient}`}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-bold text-gray-900">
              {INGREDIENT_NAMES[ingredient]}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );
}

