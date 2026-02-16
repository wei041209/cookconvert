import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { INGREDIENTS, INGREDIENT_CONVERTERS, INGREDIENT_NAMES } from '@/lib/registry';
import { buildMetadata } from '@/lib/seo';
import { normalizePathname } from '@/lib/path';
import { generateBreadcrumbJsonLd } from '@/lib/utils';
import JsonLd from '@/components/JsonLd';

type Props = {
  params: {
    converter: string;
  };
};

export async function generateStaticParams() {
  return INGREDIENT_CONVERTERS.map((converter) => ({ converter }));
}

/**
 * Convert a slug string to a title (e.g., "cups-to-grams" -> "Cups to Grams")
 * Keeps "to" lowercase for better readability
 */
function slugToTitle(slug: string): string {
  return slug.split('-').map((w) => {
    if (w.toLowerCase() === 'to') {
      return 'to';
    }
    return w.charAt(0).toUpperCase() + w.slice(1);
  }).join(' ');
}

function getConverterDescription(converter: string): string {
  switch (converter) {
    case 'cups-to-grams':
      return 'Convert cups to grams for any ingredient. Accurate ingredient-specific conversions for baking and cooking.';
    case 'grams-to-cups':
      return 'Convert grams to cups for any ingredient. Precise weight-to-volume conversions for recipe scaling.';
    case 'tbsp-to-grams':
      return 'Convert tablespoons to grams for any ingredient. Quick conversions for small measurements.';
    default:
      return 'Convert cooking measurements with ingredient-specific accuracy.';
  }
}

function getUnitDescription(converter: string): string {
  switch (converter) {
    case 'cups-to-grams':
      return 'cups to grams';
    case 'grams-to-cups':
      return 'grams to cups';
    case 'tbsp-to-grams':
      return 'tablespoons to grams';
    default:
      return 'measurements';
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { converter } = params;
  
  if (!INGREDIENT_CONVERTERS.includes(converter as any)) {
    notFound();
  }
  
  const converterTitle = slugToTitle(converter);
  const unitDescription = getUnitDescription(converter);
  
  return buildMetadata({
    pageTitle: `${converterTitle} Converter`,
    description: `Convert ${unitDescription}. Free cooking converter`,
    pathname: `/${converter}`,
  });
}

export default function ConverterPage({ params }: Props) {
  const { converter } = params;
  
  if (!INGREDIENT_CONVERTERS.includes(converter as any)) {
    notFound();
  }
  
  const converterTitle = slugToTitle(converter);
  const normalizedPath = normalizePathname(`/${converter}`);
  
  const breadcrumbs = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: converterTitle, url: `/${converter}` },
  ]);
  
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-4 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          {' / '}
          <Link href="/tools" className="hover:text-primary-600">Tools</Link>
          {' / '}
          <span className="text-gray-900">{converterTitle}</span>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{converterTitle} Converter</h1>
        
        <div className="prose max-w-none text-gray-700 mb-8">
          <p className="text-xl text-gray-600 mb-4">
            {getConverterDescription(converter)}
          </p>
          <p>
            Select an ingredient below to access the specific converter for that ingredient. Each ingredient 
            has a unique density, which ensures accurate conversions for your recipes.
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ingredients</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {INGREDIENTS.map((ingredient) => {
              const ingredientName = INGREDIENT_NAMES[ingredient];
              const ingredientPath = normalizePathname(`/${converter}/${ingredient}`);
              
              return (
                <Link
                  key={ingredient}
                  href={ingredientPath}
                  className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">{ingredientName}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {converterTitle}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
        
        <div className="prose max-w-none text-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About {converterTitle} Conversions</h2>
          <p>
            {converterTitle} conversions are ingredient-specific because different ingredients have different 
            densities. For example, a cup of flour weighs much less than a cup of honey. Our converters use 
            precise density values for each ingredient to ensure accurate conversions.
          </p>
          <p>
            All conversions are performed instantly in your browser - no data is sent to servers, ensuring 
            your privacy. The tools are mobile-friendly and work offline, making them perfect for use in the kitchen.
          </p>
        </div>
      </div>
    </>
  );
}

