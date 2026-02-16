import type { Metadata } from 'next';
import Link from 'next/link';
import { INGREDIENTS, INGREDIENT_CONVERTERS, PURE_PAGES, INGREDIENT_NAMES } from '@/lib/registry';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  pageTitle: 'All Cooking Conversion Tools',
  description: 'Browse all cooking measurement converters. Cups to grams, tablespoons to milliliters, ounces to grams, and more',
  pathname: '/tools',
});

export default function ToolsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">All Conversion Tools</h1>
      <p className="text-xl text-gray-600 mb-12">
        Choose a converter tool below to get started.
      </p>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ingredient Converters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {INGREDIENT_CONVERTERS.map((converter) => (
            <div key={converter} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {converter
                  .split('-')
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(' ')}
              </h3>
              <ul className="space-y-2">
                {INGREDIENTS.slice(0, 5).map((ingredient) => (
                  <li key={ingredient}>
                    <Link
                      href={`/${converter}/${ingredient}`}
                      className="text-primary-600 hover:text-primary-700 hover:underline"
                    >
                      {INGREDIENT_NAMES[ingredient]}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={`/${converter}`}
                    className="text-gray-600 hover:text-primary-600 font-medium"
                  >
                    View all ingredients →
                  </Link>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Pure Math Converters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PURE_PAGES.map((page) => (
            <Link
              key={page}
              href={`/${page}`}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-bold text-gray-900">
                {page
                  .split('-')
                  .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                  .join(' ')}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

