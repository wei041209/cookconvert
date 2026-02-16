import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { normalizePathname } from '@/lib/path';
import { INGREDIENTS, INGREDIENT_NAMES, INGREDIENT_DENSITIES } from '@/lib/registry';
import { generateBreadcrumbJsonLd, generateArticleJsonLd } from '@/lib/utils';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = buildMetadata({
  pageTitle: 'Kitchen Conversion Chart Guide: Complete Reference for Cooking Measurements',
  description: 'Complete kitchen conversion chart guide. Convert between cups, grams, ounces, tablespoons, milliliters, and more. Essential reference for bakers and chefs.',
  pathname: '/guides/kitchen-conversion-chart-guide',
});

export default function KitchenConversionChartGuide() {
  const popularIngredients = ['flour', 'sugar', 'brown-sugar', 'butter', 'milk', 'honey', 'olive-oil', 'salt'];
  
  // Structured data
  const breadcrumbs = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Guides', url: '/guides' },
    { name: 'Kitchen Conversion Chart Guide', url: '/guides/kitchen-conversion-chart-guide' },
  ]);
  
  const buildDate = process.env.NEXT_PUBLIC_BUILD_TIME 
    ? new Date(process.env.NEXT_PUBLIC_BUILD_TIME).toISOString()
    : new Date().toISOString();
  const articleJsonLd = generateArticleJsonLd({
    title: 'Kitchen Conversion Chart Guide: Complete Reference for Cooking Measurements',
    description: 'Complete kitchen conversion chart guide. Convert between cups, grams, ounces, tablespoons, milliliters, and more. Essential reference for bakers and chefs.',
    url: normalizePathname('/guides/kitchen-conversion-chart-guide'),
    datePublished: buildDate,
    dateModified: buildDate,
  });
  
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={articleJsonLd} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-4 text-sm text-gray-600">
        <Link href="/" className="hover:text-primary-600">Home</Link>
        {' / '}
        <Link href="/guides" className="hover:text-primary-600">Guides</Link>
        {' / '}
        <span className="text-gray-900">Kitchen Conversion Chart</span>
      </div>

      <article className="prose prose-lg max-w-none">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Kitchen Conversion Chart Guide: Complete Reference for Cooking Measurements</h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Whether you're following a recipe from another country, scaling a recipe up or down, or converting between measurement 
          systems, having a reliable kitchen conversion chart is essential. This comprehensive guide provides conversion charts for 
          all common cooking measurements, from volume to weight, and includes ingredient-specific conversions for accurate recipe 
          scaling and international recipe following.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Understanding Measurement Systems</h2>
        
        <p className="text-gray-700 mb-4">
          The world uses different measurement systems, and recipes reflect this diversity. Understanding how to convert between these 
          systems is crucial for following international recipes and scaling recipes accurately.
        </p>

        <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Volume Measurements</h3>
        
        <p className="text-gray-700 mb-4">
          Volume measurements (cups, tablespoons, teaspoons, milliliters) measure the space an ingredient occupies. These are common 
          in American recipes but vary between countries:
        </p>

        <div className="overflow-x-auto my-6">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">US Cup</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">UK Cup</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Metric Cup</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Milliliters</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-3 text-sm text-gray-700">1 US Cup</td>
                <td className="px-4 py-3 text-sm text-gray-700">0.83 UK Cup</td>
                <td className="px-4 py-3 text-sm text-gray-700">0.95 Metric Cup</td>
                <td className="px-4 py-3 text-sm text-gray-700">236.59 ml</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-3 text-sm text-gray-700">1 UK Cup</td>
                <td className="px-4 py-3 text-sm text-gray-700">1 UK Cup</td>
                <td className="px-4 py-3 text-sm text-gray-700">1.14 Metric Cup</td>
                <td className="px-4 py-3 text-sm text-gray-700">284.13 ml</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-700">1 Metric Cup</td>
                <td className="px-4 py-3 text-sm text-gray-700">0.88 UK Cup</td>
                <td className="px-4 py-3 text-sm text-gray-700">1 Metric Cup</td>
                <td className="px-4 py-3 text-sm text-gray-700">250 ml</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">Weight Measurements</h3>
        
        <p className="text-gray-700 mb-4">
          Weight measurements (grams, ounces, pounds) measure the actual mass of an ingredient. These are more accurate and are 
          preferred by professional bakers:
        </p>

        <div className="overflow-x-auto my-6">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Grams</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Ounces</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Pounds</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-3 text-sm text-gray-700">1 gram</td>
                <td className="px-4 py-3 text-sm text-gray-700">0.035 oz</td>
                <td className="px-4 py-3 text-sm text-gray-700">0.002 lb</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-3 text-sm text-gray-700">28.35 grams</td>
                <td className="px-4 py-3 text-sm text-gray-700">1 oz</td>
                <td className="px-4 py-3 text-sm text-gray-700">0.063 lb</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-700">453.59 grams</td>
                <td className="px-4 py-3 text-sm text-gray-700">16 oz</td>
                <td className="px-4 py-3 text-sm text-gray-700">1 lb</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Common Volume Conversions</h2>
        
        <div className="overflow-x-auto my-6">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Cups</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Tablespoons</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Teaspoons</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Milliliters</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-3 text-sm text-gray-700">1 cup</td>
                <td className="px-4 py-3 text-sm text-gray-700">16 tbsp</td>
                <td className="px-4 py-3 text-sm text-gray-700">48 tsp</td>
                <td className="px-4 py-3 text-sm text-gray-700">236.59 ml</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-3 text-sm text-gray-700">3/4 cup</td>
                <td className="px-4 py-3 text-sm text-gray-700">12 tbsp</td>
                <td className="px-4 py-3 text-sm text-gray-700">36 tsp</td>
                <td className="px-4 py-3 text-sm text-gray-700">177.44 ml</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-3 text-sm text-gray-700">1/2 cup</td>
                <td className="px-4 py-3 text-sm text-gray-700">8 tbsp</td>
                <td className="px-4 py-3 text-sm text-gray-700">24 tsp</td>
                <td className="px-4 py-3 text-sm text-gray-700">118.29 ml</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-3 text-sm text-gray-700">1/3 cup</td>
                <td className="px-4 py-3 text-sm text-gray-700">5.33 tbsp</td>
                <td className="px-4 py-3 text-sm text-gray-700">16 tsp</td>
                <td className="px-4 py-3 text-sm text-gray-700">78.86 ml</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-3 text-sm text-gray-700">1/4 cup</td>
                <td className="px-4 py-3 text-sm text-gray-700">4 tbsp</td>
                <td className="px-4 py-3 text-sm text-gray-700">12 tsp</td>
                <td className="px-4 py-3 text-sm text-gray-700">59.15 ml</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-700">1 tbsp</td>
                <td className="px-4 py-3 text-sm text-gray-700">1 tbsp</td>
                <td className="px-4 py-3 text-sm text-gray-700">3 tsp</td>
                <td className="px-4 py-3 text-sm text-gray-700">14.79 ml</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Ingredient-Specific Conversion Charts</h2>
        
        <p className="text-gray-700 mb-4">
          Different ingredients have different densities, so converting between volume and weight requires ingredient-specific 
          conversion factors. Here are conversions for common baking ingredients:
        </p>

        <div className="overflow-x-auto my-6">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Ingredient</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">1 Cup (grams)</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">1 Cup (ounces)</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">1 Tbsp (grams)</th>
              </tr>
            </thead>
            <tbody>
              {popularIngredients.map((ingredient) => {
                const name = INGREDIENT_NAMES[ingredient];
                const density = INGREDIENT_DENSITIES[ingredient];
                const ounces = (density / 28.35).toFixed(1);
                const tbspGrams = (density / 16).toFixed(1);
                return (
                  <tr key={ingredient} className="border-b">
                    <td className="px-4 py-3 text-sm text-gray-700 font-medium">{name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{density}g</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{ounces} oz</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{tbspGrams}g</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Temperature Conversions</h2>
        
        <p className="text-gray-700 mb-4">
          Oven temperatures vary between countries. Here's a quick reference for common baking temperatures:
        </p>

        <div className="overflow-x-auto my-6">
          <table className="min-w-full border border-gray-200 rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Fahrenheit</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Celsius</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Gas Mark</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Common Use</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-3 text-sm text-gray-700">250°F</td>
                <td className="px-4 py-3 text-sm text-gray-700">120°C</td>
                <td className="px-4 py-3 text-sm text-gray-700">1/2</td>
                <td className="px-4 py-3 text-sm text-gray-700">Very slow cooking</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-3 text-sm text-gray-700">300°F</td>
                <td className="px-4 py-3 text-sm text-gray-700">150°C</td>
                <td className="px-4 py-3 text-sm text-gray-700">2</td>
                <td className="px-4 py-3 text-sm text-gray-700">Slow baking</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-3 text-sm text-gray-700">325°F</td>
                <td className="px-4 py-3 text-sm text-gray-700">163°C</td>
                <td className="px-4 py-3 text-sm text-gray-700">3</td>
                <td className="px-4 py-3 text-sm text-gray-700">Moderate baking</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-3 text-sm text-gray-700">350°F</td>
                <td className="px-4 py-3 text-sm text-gray-700">177°C</td>
                <td className="px-4 py-3 text-sm text-gray-700">4</td>
                <td className="px-4 py-3 text-sm text-gray-700">Standard baking</td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-3 text-sm text-gray-700">375°F</td>
                <td className="px-4 py-3 text-sm text-gray-700">191°C</td>
                <td className="px-4 py-3 text-sm text-gray-700">5</td>
                <td className="px-4 py-3 text-sm text-gray-700">Moderate hot</td>
              </tr>
              <tr>
                <td className="px-4 py-3 text-sm text-gray-700">400°F</td>
                <td className="px-4 py-3 text-sm text-gray-700">204°C</td>
                <td className="px-4 py-3 text-sm text-gray-700">6</td>
                <td className="px-4 py-3 text-sm text-gray-700">Hot baking</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Using Conversion Charts Effectively</h2>
        
        <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">For International Recipes</h3>
        
        <p className="text-gray-700 mb-4">
          When following recipes from other countries, use these charts to convert measurements to your preferred system. Remember 
          that cup sizes vary, so always check which cup measurement the recipe uses (US, UK, or Metric).
        </p>

        <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">For Recipe Scaling</h3>
        
        <p className="text-gray-700 mb-4">
          When scaling recipes up or down, convert all ingredients to the same measurement system first (preferably weight), then 
          scale proportionally. This ensures accurate ratios are maintained.
        </p>

        <h3 className="text-2xl font-semibold text-gray-900 mt-8 mb-4">For Ingredient Substitutions</h3>
        
        <p className="text-gray-700 mb-4">
          When substituting ingredients, use conversion charts to ensure you're using equivalent amounts. Different ingredients 
          have different densities, so volume-to-volume substitutions aren't always accurate.
        </p>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Digital Conversion Tools</h2>
        
        <p className="text-gray-700 mb-4">
          While conversion charts are useful references, digital conversion tools provide more accuracy and convenience. Our conversion 
          calculators use precise density values for each ingredient, ensuring accurate conversions for your specific needs.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <Link
            href={normalizePathname('/cups-to-ml')}
            className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <h4 className="font-semibold text-gray-900 mb-2">Cups to Milliliters</h4>
            <p className="text-sm text-gray-600">Convert volume measurements accurately</p>
          </Link>
          <Link
            href={normalizePathname('/oz-to-grams')}
            className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <h4 className="font-semibold text-gray-900 mb-2">Ounces to Grams</h4>
            <p className="text-sm text-gray-600">Convert weight measurements</p>
          </Link>
          <Link
            href={normalizePathname('/tbsp-to-ml')}
            className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <h4 className="font-semibold text-gray-900 mb-2">Tablespoons to Milliliters</h4>
            <p className="text-sm text-gray-600">Convert small volume measurements</p>
          </Link>
          <Link
            href={normalizePathname('/tools')}
            className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <h4 className="font-semibold text-gray-900 mb-2">All Conversion Tools</h4>
            <p className="text-sm text-gray-600">View all available converters</p>
          </Link>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Tips for Accurate Conversions</h2>
        
        <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
          <li><strong>Use weight for precision:</strong> When accuracy matters, use weight measurements (grams) rather than volume</li>
          <li><strong>Check ingredient density:</strong> Different ingredients have different densities; use ingredient-specific conversions</li>
          <li><strong>Verify oven temperature:</strong> Use an oven thermometer to ensure your oven matches the recipe temperature</li>
          <li><strong>Round appropriately:</strong> For practical use, round conversions to reasonable measurements (e.g., 0.47 cups to 0.5 cups)</li>
          <li><strong>Double-check critical measurements:</strong> For leavening agents and other critical ingredients, verify conversions</li>
        </ul>

        <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6">Conclusion: Your Complete Conversion Reference</h2>
        
        <p className="text-gray-700 mb-4">
          This conversion chart guide provides comprehensive reference material for all common cooking measurements. Keep it bookmarked 
          for quick reference when following international recipes, scaling recipes, or converting between measurement systems.
        </p>

        <p className="text-gray-700 mb-4">
          Remember that while charts provide good approximations, ingredient-specific conversion tools offer the highest accuracy. For 
          critical recipes, use our digital conversion calculators that account for precise ingredient densities.
        </p>

        <p className="text-gray-700 mb-8">
          With these conversion charts and tools at your disposal, you can confidently tackle any recipe, regardless of the measurement 
          system it uses. Whether you're baking a French pastry, following a British recipe, or scaling your favorite American recipe, 
          accurate conversions ensure successful results.
        </p>

        <div className="bg-primary-50 border border-primary-200 rounded-lg p-6 mt-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Use Our Conversion Tools</h3>
          <p className="text-gray-700 mb-4">
            For the most accurate conversions, use our ingredient-specific conversion calculators. They account for precise density 
            values and provide instant, accurate results for all your conversion needs.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/tools"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              View All Tools →
            </Link>
            <Link
              href="/guides"
              className="inline-block px-6 py-3 bg-white border border-primary-600 text-primary-600 rounded-lg hover:bg-primary-50 transition-colors font-medium"
            >
              More Guides →
            </Link>
          </div>
        </div>
      </article>
      </div>
    </>
  );
}

