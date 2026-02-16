import type { Metadata } from 'next';
import Link from 'next/link';
import { INGREDIENTS, INGREDIENT_CONVERTERS, PURE_PAGES, INGREDIENT_NAMES } from '@/lib/registry';
import { buildMetadata } from '@/lib/seo';
import { getSiteUrl } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  pageTitle: 'CookConvert - Free Cooking Measurement Converter',
  description: 'Convert cooking measurements instantly. Cups to grams, tablespoons to milliliters, and more. Free cooking conversion tool for bakers and chefs',
  pathname: '/',
});

export default function HomePage() {
  const siteUrl = getSiteUrl();
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CookConvert',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteUrl}/tools?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Cooking Measurement Converter
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Convert cooking measurements instantly. Cups to grams, tablespoons to milliliters, and more. 
            Free tool for bakers and chefs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Ingredient Converters</h2>
            <p className="text-gray-600 mb-4">
              Convert measurements for specific ingredients like flour, sugar, butter, and more.
            </p>
            <Link
              href="/tools"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View all converters →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Pure Math Converters</h2>
            <p className="text-gray-600 mb-4">
              Convert between standard measurement units like cups to milliliters, ounces to grams.
            </p>
            <Link
              href="/tools"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              View all converters →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Ingredient Guides</h2>
            <p className="text-gray-600 mb-4">
              Learn about ingredients, their densities, and conversion tips.
            </p>
            <Link
              href="/ingredients"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Browse ingredients →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Popular Converters</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              href="/cups-to-grams/flour"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Flour</div>
              <div className="text-sm text-gray-600">Cups to Grams</div>
            </Link>
            <Link
              href="/cups-to-grams/sugar"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Sugar</div>
              <div className="text-sm text-gray-600">Cups to Grams</div>
            </Link>
            <Link
              href="/cups-to-ml"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Cups to ML</div>
              <div className="text-sm text-gray-600">Volume Converter</div>
            </Link>
            <Link
              href="/oz-to-grams"
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <div className="font-medium text-gray-900">Oz to Grams</div>
              <div className="text-sm text-gray-600">Weight Converter</div>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About CookConvert</h2>
          <div className="prose max-w-none text-gray-700">
            <p className="mb-4">
              CookConvert is a free, easy-to-use cooking measurement converter designed for bakers, 
              chefs, and home cooks. Whether you're converting cups to grams for flour, tablespoons 
              to milliliters for liquids, or any other cooking measurement, our tool provides instant, 
              accurate conversions.
            </p>
            <p className="mb-4">
              Our converter supports over 20 common ingredients with precise density values, ensuring 
              accurate conversions for your recipes. We understand that cooking measurements can vary 
              by ingredient, which is why we provide ingredient-specific converters alongside general 
              unit converters.
            </p>
            <p className="mb-4">
              All conversions are performed instantly in your browser - no data is sent to servers, 
              ensuring your privacy. The tool is mobile-friendly and works offline, making it perfect 
              for use in the kitchen.
            </p>
            <p>
              Start converting your cooking measurements today and take the guesswork out of recipe 
              conversions!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

