import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import EEATSection from '@/components/EEATSection';
import PopularIngredients from '@/components/PopularIngredients';
import AdSlot from '@/components/AdSlot';
import JsonLd from '@/components/JsonLd';

// Lazy load components
const FAQ = dynamic(() => import('@/components/FAQ'), {
  ssr: true,
});

const RelatedConversions = dynamic(() => import('@/components/RelatedConversions'), {
  ssr: true,
});

import {
  INGREDIENTS,
  INGREDIENT_NAMES,
  INGREDIENT_DENSITIES,
} from '@/lib/registry';
import {
  cupsToGrams,
  gramsToCups,
  formatNumber,
} from '@/lib/conversion';
import {
  generateBreadcrumbJsonLd,
  generateFAQJsonLd,
  generateArticleJsonLd,
  getRelatedConversions,
} from '@/lib/utils';
import { buildMetadata } from '@/lib/seo';
import { normalizePathname } from '@/lib/path';

type Props = {
  params: {
    query: string;
  };
};

// Supported gram values for generation
const GRAM_VALUES = [50, 100, 200, 250, 500];

// Supported cup values for generation
const CUP_VALUES = [0.5, 1, 2, 3];

/**
 * Parse query string to extract conversion parameters
 * Examples:
 * - "200-grams-sour-cream-to-cups" -> { amount: 200, fromUnit: 'grams', ingredient: 'sour-cream', toUnit: 'cups' }
 * - "2-cups-flour-to-grams" -> { amount: 2, fromUnit: 'cups', ingredient: 'flour', toUnit: 'grams' }
 */
function parseQuery(query: string): {
  amount: number;
  fromUnit: 'grams' | 'cups';
  ingredient: string;
  toUnit: 'grams' | 'cups';
} | null {
  // Pattern 1: [number]-grams-[ingredient]-to-cups
  const gramsToCupsMatch = query.match(/^(\d+(?:\.\d+)?)-grams-(.+)-to-cups$/);
  if (gramsToCupsMatch) {
    const amount = parseFloat(gramsToCupsMatch[1]);
    const ingredient = gramsToCupsMatch[2];
    if (INGREDIENTS.includes(ingredient as any) && !isNaN(amount) && amount > 0) {
      return { amount, fromUnit: 'grams', ingredient, toUnit: 'cups' };
    }
  }

  // Pattern 2: [number]-cups-[ingredient]-to-grams
  const cupsToGramsMatch = query.match(/^(\d+(?:\.\d+)?)-cups-(.+)-to-grams$/);
  if (cupsToGramsMatch) {
    const amount = parseFloat(cupsToGramsMatch[1]);
    const ingredient = cupsToGramsMatch[2];
    if (INGREDIENTS.includes(ingredient as any) && !isNaN(amount) && amount > 0) {
      return { amount, fromUnit: 'cups', ingredient, toUnit: 'grams' };
    }
  }

  return null;
}

/**
 * Generate static params for all valid combinations
 */
export async function generateStaticParams() {
  const params: { query: string }[] = [];

  // Generate grams-to-cups pages
  GRAM_VALUES.forEach((grams) => {
    INGREDIENTS.forEach((ingredient) => {
      params.push({
        query: `${grams}-grams-${ingredient}-to-cups`,
      });
    });
  });

  // Generate cups-to-grams pages
  CUP_VALUES.forEach((cups) => {
    INGREDIENTS.forEach((ingredient) => {
      params.push({
        query: `${cups}-cups-${ingredient}-to-grams`,
      });
    });
  });

  return params;
}

/**
 * Generate FAQs for specific conversion query
 */
function generateFAQs(
  amount: number,
  fromUnit: 'grams' | 'cups',
  ingredient: string,
  ingredientName: string,
  density: number,
  result: number
): { question: string; answer: string }[] {
  const faqs: { question: string; answer: string }[] = [];

  if (fromUnit === 'grams') {
    // Question 1: Direct answer
    faqs.push({
      question: `How many cups is ${amount} grams of ${ingredientName}?`,
      answer: `${amount} grams of ${ingredientName} equals approximately ${formatNumber(result)} ${result === 1 ? 'cup' : 'cups'}. To convert grams to cups for ${ingredientName}, divide the number of grams by ${density} (the density of ${ingredientName} in grams per cup). This conversion is essential when following recipes that use weight measurements, especially in professional baking where precision matters.`,
    });

    // Question 2: Conversion method
    faqs.push({
      question: `How do I convert ${amount} grams of ${ingredientName} to cups?`,
      answer: `To convert ${amount} grams of ${ingredientName} to cups, divide ${amount} by ${density} (the density of ${ingredientName}). This gives you ${formatNumber(result)} ${result === 1 ? 'cup' : 'cups'}. You can use our converter tool or this formula: cups = grams ÷ ${density}. For accurate results, use a kitchen scale to measure grams first, then convert to cups using this calculation.`,
    });

    // Question 3: Density explanation
    faqs.push({
      question: `What is the density of ${ingredientName}?`,
      answer: `The density of ${ingredientName} is ${density} grams per cup. This means that one cup of ${ingredientName} weighs ${density} grams. Understanding this density is crucial for accurate conversions between weight and volume measurements. The density value is based on standard culinary measurements and ensures precise conversions for your recipes.`,
    });

    // Question 4: Half cup equivalence
    const halfCupGrams = Math.round(density * 0.5);
    faqs.push({
      question: `Is ${halfCupGrams} grams of ${ingredientName} equal to half a cup?`,
      answer: `Yes, ${halfCupGrams} grams of ${ingredientName} equals exactly half a cup (0.5 cups). Since ${ingredientName} has a density of ${density} grams per cup, half a cup weighs ${halfCupGrams} grams. This conversion is useful when you need to halve a recipe or when your kitchen scale shows ${halfCupGrams} grams.`,
    });

    // Question 5: Rounding and precision
    faqs.push({
      question: `Can I round ${formatNumber(result)} cups of ${ingredientName} to a simpler measurement?`,
      answer: `Yes, you can round ${formatNumber(result)} cups to a more practical measurement for most recipes. For example, if the result is close to 0.5, 0.75, or 1 cup, you can round to the nearest practical measurement. However, for critical baking recipes, use the precise value ${formatNumber(result)} cups for the most accurate results.`,
    });

    // Question 6: Why density matters
    faqs.push({
      question: `Why does ${ingredientName} conversion depend on density?`,
      answer: `${ingredientName} conversion depends on density because different ingredients have different weights for the same volume. ${ingredientName} has a density of ${density} grams per cup, which means one cup weighs ${density} grams. Without knowing this specific density value, you can't accurately convert between grams and cups. This is why ingredient-specific converters are essential.`,
    });

    // Question 7: Comparison
    const comparisonIngredient = density > 200 ? 'flour' : 'honey';
    const comparisonDensity = comparisonIngredient === 'flour' ? 120 : 340;
    const comparisonCups = formatNumber(amount / comparisonDensity);
    faqs.push({
      question: `How does ${amount} grams of ${ingredientName} compare to ${comparisonIngredient}?`,
      answer: `${amount} grams of ${ingredientName} equals ${formatNumber(result)} cups, while ${amount} grams of ${comparisonIngredient} equals ${comparisonCups} cups. This difference occurs because ${ingredientName} has a density of ${density} grams per cup, while ${comparisonIngredient} has a density of ${comparisonDensity} grams per cup. This is why ingredient-specific conversions are essential for accurate recipe measurements.`,
    });

    // Question 8: Measurement tools
    faqs.push({
      question: `Can I use a measuring cup instead of a scale for ${ingredientName}?`,
      answer: `While you can use a measuring cup for ${ingredientName}, a kitchen scale provides more accurate results, especially for baking. Measuring cups can vary by 10-20% depending on how you pack or level the ingredient. For best accuracy, use a digital kitchen scale to measure ${amount} grams, then convert to cups if needed. Our converter helps you convert between these measurement methods accurately.`,
    });
  } else {
    // cups-to-grams FAQs
    // Question 1: Direct answer
    faqs.push({
      question: `How many grams is ${amount} ${amount === 1 ? 'cup' : 'cups'} of ${ingredientName}?`,
      answer: `${amount} ${amount === 1 ? 'cup' : 'cups'} of ${ingredientName} equals ${Math.round(result)} grams. To convert cups to grams for ${ingredientName}, multiply the number of cups by ${density} (the density of ${ingredientName} in grams per cup). This conversion is essential when following recipes that use weight measurements or when you need to scale a recipe up or down.`,
    });

    // Question 2: Conversion method
    faqs.push({
      question: `How do I convert ${amount} ${amount === 1 ? 'cup' : 'cups'} of ${ingredientName} to grams?`,
      answer: `To convert ${amount} ${amount === 1 ? 'cup' : 'cups'} of ${ingredientName} to grams, multiply ${amount} by ${density} (the density of ${ingredientName}). This gives you ${Math.round(result)} grams. You can use our converter tool or this formula: grams = cups × ${density}. For accurate results, use proper measuring cups and level them off correctly.`,
    });

    // Question 3: Density explanation
    faqs.push({
      question: `What is the density of ${ingredientName}?`,
      answer: `The density of ${ingredientName} is ${density} grams per cup. This means that one cup of ${ingredientName} weighs ${density} grams. Understanding this density is crucial for accurate conversions between volume and weight measurements. The density value is based on standard culinary measurements and ensures precise conversions for your recipes.`,
    });

    // Question 4: Half cup
    if (amount !== 0.5) {
      const halfCupGrams = Math.round(density * 0.5);
      faqs.push({
        question: `How many grams is half a cup of ${ingredientName}?`,
        answer: `Half a cup (0.5 cups) of ${ingredientName} weighs ${halfCupGrams} grams. Since ${ingredientName} has a density of ${density} grams per cup, half a cup is simply ${density} divided by 2, which equals ${halfCupGrams} grams. This conversion is useful when halving recipes or when you need a smaller amount.`,
      });
    }

    // Question 5: Rounding
    faqs.push({
      question: `Is ${Math.round(result)} grams of ${ingredientName} an exact measurement?`,
      answer: `${Math.round(result)} grams is the calculated weight for ${amount} ${amount === 1 ? 'cup' : 'cups'} of ${ingredientName} based on its density of ${density} grams per cup. For most recipes, this rounded value works well. However, for critical baking recipes, you may want to use the precise value of ${formatNumber(result)} grams for maximum accuracy.`,
    });

    // Question 6: Why density matters
    faqs.push({
      question: `Why does ${ingredientName} conversion depend on density?`,
      answer: `${ingredientName} conversion depends on density because different ingredients have different weights for the same volume. ${ingredientName} has a density of ${density} grams per cup, which means one cup weighs ${density} grams. Without knowing this specific density value, you can't accurately convert between cups and grams. This is why ingredient-specific converters are essential.`,
    });

    // Question 7: Comparison
    const comparisonIngredient = density > 200 ? 'flour' : 'honey';
    const comparisonDensity = comparisonIngredient === 'flour' ? 120 : 340;
    const comparisonGrams = Math.round(amount * comparisonDensity);
    faqs.push({
      question: `How does ${amount} ${amount === 1 ? 'cup' : 'cups'} of ${ingredientName} compare to ${comparisonIngredient}?`,
      answer: `${amount} ${amount === 1 ? 'cup' : 'cups'} of ${ingredientName} equals ${Math.round(result)} grams, while ${amount} ${amount === 1 ? 'cup' : 'cups'} of ${comparisonIngredient} equals ${comparisonGrams} grams. This difference occurs because ${ingredientName} has a density of ${density} grams per cup, while ${comparisonIngredient} has a density of ${comparisonDensity} grams per cup. This is why ingredient-specific conversions are essential.`,
    });

    // Question 8: Measurement tools
    faqs.push({
      question: `Can I use a measuring cup instead of a scale for ${ingredientName}?`,
      answer: `While you can use a measuring cup for ${ingredientName}, a kitchen scale provides more accurate results, especially for baking. Measuring cups can vary by 10-20% depending on how you pack or level the ingredient. For best accuracy, use proper measuring cups and level them off correctly, or use a digital kitchen scale to measure grams directly.`,
    });
  }

  return faqs;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { query } = params;
  const parsed = parseQuery(query);

  if (!parsed) {
    notFound();
  }

  const { amount, fromUnit, ingredient, toUnit } = parsed;
  const ingredientName = INGREDIENT_NAMES[ingredient];
  const density = INGREDIENT_DENSITIES[ingredient];

  let result: number;
  if (fromUnit === 'grams') {
    result = gramsToCups(amount, ingredient);
  } else {
    result = cupsToGrams(amount, ingredient);
  }

  const resultFormatted = fromUnit === 'grams' 
    ? formatNumber(result) 
    : Math.round(result).toString();

  const resultUnit = fromUnit === 'grams' ? 'cups' : 'grams';
  const amountDisplay = fromUnit === 'grams' 
    ? `${amount}g` 
    : `${amount} ${amount === 1 ? 'cup' : 'cups'}`;
  const resultDisplay = fromUnit === 'grams'
    ? `${resultFormatted} ${result === 1 ? 'cup' : 'cups'}`
    : `${resultFormatted}g`;

  const pageTitle = `${amountDisplay} ${ingredientName} to ${resultUnit.charAt(0).toUpperCase() + resultUnit.slice(1)} - Conversion Calculator`;
  const description = `Convert ${amountDisplay} of ${ingredientName} to ${resultDisplay}. Free, instant conversion calculator with accurate density values. Perfect for baking and cooking recipes.`;

  return buildMetadata({
    pageTitle,
    description,
    pathname: normalizePathname(`/q/${query}`),
  });
}

export default function ConversionQueryPage({ params }: Props) {
  const { query } = params;
  const parsed = parseQuery(query);

  if (!parsed) {
    notFound();
  }

  const { amount, fromUnit, ingredient, toUnit } = parsed;
  const ingredientName = INGREDIENT_NAMES[ingredient];
  const density = INGREDIENT_DENSITIES[ingredient];

  // Calculate result
  let result: number;
  if (fromUnit === 'grams') {
    result = gramsToCups(amount, ingredient);
  } else {
    result = cupsToGrams(amount, ingredient);
  }

  const resultFormatted = fromUnit === 'grams' 
    ? formatNumber(result) 
    : Math.round(result).toString();

  const resultUnit = fromUnit === 'grams' ? 'cups' : 'grams';
  const amountDisplay = fromUnit === 'grams' 
    ? `${amount}g` 
    : `${amount} ${amount === 1 ? 'cup' : 'cups'}`;
  const resultDisplay = fromUnit === 'grams'
    ? `${resultFormatted} ${result === 1 ? 'cup' : 'cups'}`
    : `${resultFormatted}g`;

  // Generate FAQs
  const faqs = generateFAQs(amount, fromUnit, ingredient, ingredientName, density, result);

  // Generate related conversions
  const relatedConversions = getRelatedConversions(
    normalizePathname(`/${fromUnit === 'grams' ? 'grams-to-cups' : 'cups-to-grams'}/${ingredient}`),
    ingredient
  );

  // Structured data
  const queryPath = normalizePathname(`/q/${query}`);
  const breadcrumbs = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: `${amountDisplay} ${ingredientName}`, url: queryPath },
  ]);

  const faqJsonLd = generateFAQJsonLd(faqs);

  const buildDate = process.env.NEXT_PUBLIC_BUILD_TIME 
    ? new Date(process.env.NEXT_PUBLIC_BUILD_TIME).toISOString()
    : new Date().toISOString();
  
  const articleJsonLd = generateArticleJsonLd({
    title: `${amountDisplay} ${ingredientName} to ${resultUnit.charAt(0).toUpperCase() + resultUnit.slice(1)}`,
    description: `Convert ${amountDisplay} of ${ingredientName} to ${resultDisplay}. Free, instant conversion calculator with accurate density values.`,
    url: queryPath,
    datePublished: buildDate,
    dateModified: buildDate,
  });

  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={articleJsonLd} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-4 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          {' / '}
          <Link href="/tools" className="hover:text-primary-600">Tools</Link>
          {' / '}
          <span className="text-gray-900">{amountDisplay} {ingredientName}</span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-6">
          {amountDisplay} {ingredientName} to {resultUnit.charAt(0).toUpperCase() + resultUnit.slice(1)}
        </h1>

        {/* Prominent Result Display */}
        <div className="bg-primary-50 border-2 border-primary-200 rounded-lg p-8 mb-8 text-center">
          <div className="text-sm text-gray-600 mb-2 font-medium">Conversion Result</div>
          <div className="text-5xl font-bold text-primary-700 mb-2">
            {resultDisplay}
          </div>
          <div className="text-lg text-gray-700">
            {amountDisplay} of {ingredientName} = {resultDisplay}
          </div>
        </div>

        {/* Explanatory Content */}
        <div className="prose max-w-none text-gray-700 mb-8">
          <p className="text-xl text-gray-600 mb-4">
            <strong>{amountDisplay} of {ingredientName} equals {resultDisplay}.</strong> This conversion is based on{' '}
            {ingredientName}'s density of {density} grams per cup, which ensures accurate measurements for your recipes.
          </p>
          <p>
            When converting {amountDisplay} of {ingredientName} to {resultUnit}, it's important to use the correct density 
            value. {ingredientName} has a density of {density} grams per cup, meaning one cup weighs {density} grams. 
            This ingredient-specific density ensures that your conversions are accurate and your recipes turn out as intended.
          </p>
          <p>
            Whether you're following a recipe that uses different measurement units, scaling a recipe up or down, or 
            converting between weight and volume measurements, this conversion provides the precise result you need. 
            For best results in baking, use a kitchen scale when possible, but this conversion allows you to work 
            with either measurement system confidently.
          </p>
          <p>
            Our conversion calculator uses the precise density of {ingredientName} to ensure accuracy. This is especially 
            important in baking, where precise measurements can make the difference between success and failure. The 
            density value of {density} grams per cup is based on standard culinary measurements and is suitable for 
            most home baking and cooking applications.
          </p>
        </div>

        <AdSlot position="mid-content" />

        {/* Conversion Details Table */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Conversion Details</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Measurement</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium">Amount</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{amountDisplay}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium">Ingredient</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{ingredientName}</td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium">Density</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{density} grams per cup</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-sm text-gray-700 font-medium">Result</td>
                  <td className="px-4 py-3 text-sm text-gray-700 font-semibold">{resultDisplay}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Related Tools */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Conversion Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href={normalizePathname(`/${fromUnit === 'grams' ? 'grams-to-cups' : 'cups-to-grams'}/${ingredient}`)}
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <div className="font-semibold text-gray-900 mb-1">
                {ingredientName} {fromUnit === 'grams' ? 'Grams to Cups' : 'Cups to Grams'} Converter
              </div>
              <div className="text-sm text-gray-600">
                Convert any amount of {ingredientName} between {fromUnit === 'grams' ? 'grams and cups' : 'cups and grams'}
              </div>
            </Link>
            <Link
              href={normalizePathname(`/ingredients/${ingredient}`)}
              className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
            >
              <div className="font-semibold text-gray-900 mb-1">
                {ingredientName} Ingredient Guide
              </div>
              <div className="text-sm text-gray-600">
                Learn more about {ingredientName}, its density, and conversion tips
              </div>
            </Link>
          </div>
        </div>

        <FAQ items={faqs} />

        <EEATSection lastUpdated={new Date(buildDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })} />

        <PopularIngredients excludeIngredient={ingredient} maxItems={12} />

        <RelatedConversions conversions={relatedConversions} />
      </div>
    </>
  );
}


