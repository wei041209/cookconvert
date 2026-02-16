import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Converter from '@/components/Converter';
import ConversionTable from '@/components/ConversionTable';
import FAQ from '@/components/FAQ';
import RelatedTools from '@/components/RelatedTools';
import AdSlot from '@/components/AdSlot';
import JsonLd from '@/components/JsonLd';
import {
  INGREDIENTS,
  INGREDIENT_CONVERTERS,
  INGREDIENT_NAMES,
  INGREDIENT_DENSITIES,
} from '@/lib/registry';
import {
  cupsToGrams,
  gramsToCups,
  tbspToGrams,
  formatNumber,
} from '@/lib/conversion';
import {
  generateBreadcrumbJsonLd,
  generateFAQJsonLd,
  getRelatedTools,
} from '@/lib/utils';
import { buildMetadata } from '@/lib/seo';
import { normalizePathname } from '@/lib/path';

type Props = {
  params: {
    converter: string;
    ingredient: string;
  };
};

export async function generateStaticParams() {
  const params: { converter: string; ingredient: string }[] = [];
  
  INGREDIENT_CONVERTERS.forEach((converter) => {
    INGREDIENTS.forEach((ingredient) => {
      params.push({ converter, ingredient });
    });
  });
  
  return params;
}

function getConverterTitle(converter: string, ingredient: string): string {
  const ingredientName = INGREDIENT_NAMES[ingredient];
  // Convert slug to readable format (e.g., "cups-to-grams" -> "Cups to Grams")
  const converterName = converter
    .split('-')
    .map((w) => {
      if (w.toLowerCase() === 'to') {
        return 'to';
      }
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join(' ');
  return `${ingredientName}: ${converterName} Converter`;
}

function getUnits(converter: string): { from: string; to: string } {
  switch (converter) {
    case 'cups-to-grams':
      return { from: 'Cups', to: 'Grams' };
    case 'grams-to-cups':
      return { from: 'Grams', to: 'Cups' };
    case 'tbsp-to-grams':
      return { from: 'Tablespoons', to: 'Grams' };
    default:
      return { from: '', to: '' };
  }
}

function getQuickValues(converter: string): number[] {
  switch (converter) {
    case 'cups-to-grams':
      return [0.25, 0.5, 1, 2, 3];
    case 'grams-to-cups':
      return [50, 100, 200, 300, 500];
    case 'tbsp-to-grams':
      return [1, 2, 4, 8, 16];
    default:
      return [];
  }
}

function generateTableData(converter: string, ingredient: string) {
  const density = INGREDIENT_DENSITIES[ingredient];
  const data: (string | number)[][] = [];
  
  if (converter === 'cups-to-grams') {
    for (let i = 0.25; i <= 2; i += 0.25) {
      data.push([formatNumber(i), formatNumber(cupsToGrams(i, ingredient))]);
    }
  } else if (converter === 'grams-to-cups') {
    for (let i = 50; i <= 500; i += 50) {
      data.push([i.toString(), formatNumber(gramsToCups(i, ingredient))]);
    }
  } else if (converter === 'tbsp-to-grams') {
    for (let i = 1; i <= 16; i++) {
      data.push([i.toString(), formatNumber(tbspToGrams(i, ingredient))]);
    }
  }
  
  return data;
}

function getConverterSpecificContent(converter: string, ingredientName: string) {
  switch (converter) {
    case 'cups-to-grams':
      return {
        explanatory: (
          <p>
            When measuring {ingredientName} by volume, accuracy depends on how you pack and level the measuring cup. 
            For best results in baking, spoon {ingredientName} into the measuring cup and level it off with a straight 
            edge. Avoid packing or tapping the cup, as this can significantly increase the weight. Our converter uses 
            the standard density for {ingredientName}, which assumes a properly leveled cup measurement.
          </p>
        ),
        tips: [
          'Spoon the ingredient into the measuring cup rather than scooping directly from the container',
          'Level off the top with a straight edge (like a knife) for consistent measurements',
          'For baking recipes, consider using a kitchen scale for the most accurate results',
        ],
      };
    case 'grams-to-cups':
      return {
        explanatory: (
          <p>
            Converting grams to cups for {ingredientName} is most accurate when you start with a weight measurement 
            from a kitchen scale. Professional bakers prefer weight measurements because they're consistent regardless 
            of how the ingredient is packed. Our converter provides precise conversions, but keep in mind that the 
            result may need slight rounding for practical use. For example, if the converter shows 0.47 cups, you can 
            safely round to 0.5 cups (half a cup) for most recipes.
          </p>
        ),
        tips: [
          'Use a digital kitchen scale for the most accurate weight measurements',
          'Round the converted cup value to the nearest practical measurement (e.g., 0.25, 0.5, 1 cup)',
          'For critical baking recipes, stick with weight measurements when possible',
        ],
      };
    case 'tbsp-to-grams':
      return {
        explanatory: (
          <p>
            Converting tablespoons to grams for {ingredientName} requires attention to how you measure the spoon. 
            Tablespoon measurements can vary based on whether the spoon is heaped, leveled, or slightly rounded. 
            For consistent results, use a proper measuring spoon and level it off with a straight edge. Our converter 
            assumes a leveled tablespoon measurement, which is the standard for recipe conversions.
          </p>
        ),
        tips: [
          'Use proper measuring spoons, not regular eating utensils, for accurate measurements',
          'Level off the spoon with a straight edge to ensure consistent volume',
          'For small amounts, consider using a kitchen scale for better precision',
        ],
      };
    default:
      return {
        explanatory: null,
        tips: [],
      };
  }
}

function generateFAQs(converter: string, ingredient: string) {
  const ingredientName = INGREDIENT_NAMES[ingredient];
  const density = INGREDIENT_DENSITIES[ingredient];
  
  // Converter-specific first question
  let firstQuestion: { question: string; answer: string };
  
  switch (converter) {
    case 'cups-to-grams':
      firstQuestion = {
        question: `How do I convert cups to grams for ${ingredientName}?`,
        answer: `To convert cups to grams for ${ingredientName}, multiply the number of cups by ${density}. For example, 2 cups of ${ingredientName} equals ${2 * density} grams. Use our converter above for instant, accurate conversions. ${ingredientName} has a density of ${density} grams per cup.`,
      };
      break;
    case 'grams-to-cups':
      firstQuestion = {
        question: `How do I convert grams to cups for ${ingredientName}?`,
        answer: `To convert grams to cups for ${ingredientName}, divide the number of grams by ${density}. For example, ${density} grams of ${ingredientName} equals 1 cup. Use our converter above for instant, accurate conversions. ${ingredientName} has a density of ${density} grams per cup.`,
      };
      break;
    case 'tbsp-to-grams':
      firstQuestion = {
        question: `How do I convert tablespoons to grams for ${ingredientName}?`,
        answer: `To convert tablespoons to grams for ${ingredientName}, use our converter above. Since there are 16 tablespoons in one cup, and ${ingredientName} has a density of ${density} grams per cup, each tablespoon of ${ingredientName} weighs approximately ${formatNumber(density / 16)} grams.`,
      };
      break;
    default:
      firstQuestion = {
        question: `How do I convert measurements for ${ingredientName}?`,
        answer: `Use our converter above for instant, accurate conversions. ${ingredientName} has a density of ${density} grams per cup.`,
      };
  }
  
  return [
    firstQuestion,
    {
      question: `What is the density of ${ingredientName}?`,
      answer: `${ingredientName} has a density of approximately ${density} grams per cup. This value is used for accurate conversions between volume and weight measurements.`,
    },
    {
      question: `Why do different ingredients have different conversion rates?`,
      answer: `Different ingredients have different densities. For example, ${ingredientName} weighs ${density} grams per cup, while lighter ingredients like flour weigh less, and heavier ingredients like honey weigh more. This is why ingredient-specific converters are important for accuracy.`,
    },
    {
      question: `Can I use this converter for recipes?`,
      answer: `Yes! Our converter is designed specifically for recipe conversions. The values are based on standard culinary measurements and are suitable for most baking and cooking applications.`,
    },
    {
      question: `How accurate are these conversions?`,
      answer: `Our conversions use precise density values for each ingredient. However, slight variations may occur based on factors like ingredient packing, temperature, and brand. For most recipes, these conversions provide excellent accuracy.`,
    },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { converter, ingredient } = params;
  
  if (!INGREDIENT_CONVERTERS.includes(converter as any) || !INGREDIENTS.includes(ingredient as any)) {
    notFound();
  }
  
  const title = getConverterTitle(converter, ingredient);
  const ingredientName = INGREDIENT_NAMES[ingredient];
  const units = getUnits(converter);
  
  return buildMetadata({
    pageTitle: title,
    description: `Convert ${units.from.toLowerCase()} to ${units.to.toLowerCase()} for ${ingredientName}. Free, instant cooking measurement converter with accurate density values`,
    pathname: `/${converter}/${ingredient}`,
  });
}

export default function IngredientConverterPage({ params }: Props) {
  const { converter, ingredient } = params;
  
  if (!INGREDIENT_CONVERTERS.includes(converter as any) || !INGREDIENTS.includes(ingredient as any)) {
    notFound();
  }
  
  const title = getConverterTitle(converter, ingredient);
  const units = getUnits(converter);
  const ingredientName = INGREDIENT_NAMES[ingredient];
  const density = INGREDIENT_DENSITIES[ingredient];
  const tableData = generateTableData(converter, ingredient);
  const faqs = generateFAQs(converter, ingredient);
  const normalizedPath = normalizePathname(`/${converter}/${ingredient}`);
  const relatedTools = getRelatedTools(normalizedPath, ingredient);
  const quickValues = getQuickValues(converter);
  const converterContent = getConverterSpecificContent(converter, ingredientName);
  
  const breadcrumbs = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: ingredientName, url: `/${converter}/${ingredient}` },
  ]);
  
  const faqJsonLd = generateFAQJsonLd(faqs);
  
  return (
    <>
      <JsonLd data={breadcrumbs} />
      <JsonLd data={faqJsonLd} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-4 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          {' / '}
          <Link href="/tools" className="hover:text-primary-600">Tools</Link>
          {' / '}
          <span className="text-gray-900">{ingredientName}</span>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-6">{title}</h1>
        
        <div className="prose max-w-none text-gray-700 mb-8">
          <p>
            Convert {units.from.toLowerCase()} to {units.to.toLowerCase()} for {ingredientName} with our 
            free, instant cooking measurement converter. {ingredientName} has a density of {density} grams 
            per cup, which ensures accurate conversions for your recipes.
          </p>
          <p>
            Whether you're following a recipe that uses different measurement units or scaling a recipe 
            up or down, our converter provides instant, accurate results. Simply enter your measurement 
            and get the converted value immediately.
          </p>
          <p>
            Our converter is designed specifically for {ingredientName}, using precise density values to 
            ensure accuracy. This is especially important in baking, where precise measurements can make 
            the difference between success and failure.
          </p>
          <p>
            All conversions are performed instantly in your browser - no data is sent to servers, ensuring 
            your privacy. The tool is mobile-friendly and works offline, making it perfect for use in 
            the kitchen.
          </p>
        </div>
        
        <Converter
          title={`${units.from} to ${units.to}`}
          fromUnit={units.from}
          toUnit={units.to}
          converterKey={converter as 'cups-to-grams' | 'grams-to-cups' | 'tbsp-to-grams'}
          ingredient={ingredient}
          quickValues={quickValues}
        />
        
        <AdSlot position="below-converter" />
        
        <ConversionTable
          title={`${ingredientName}: ${units.from} to ${units.to} Conversion Table`}
          headers={[units.from, units.to]}
          rows={tableData}
        />
        
        <div className="prose max-w-none text-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding {ingredientName} Conversions</h2>
          <p>
            Converting measurements for {ingredientName} requires understanding its density. With a density 
            of {density} grams per cup, {ingredientName} is {density > 200 ? 'denser' : 'less dense'} than 
            many other common ingredients. This means that one cup of {ingredientName} weighs {density} grams.
          </p>
          <p>
            When converting {units.from.toLowerCase()} to {units.to.toLowerCase()}, it's important to use 
            ingredient-specific converters like this one, as different ingredients have vastly different 
            densities. For example, a cup of flour weighs much less than a cup of {ingredientName}.
          </p>
          
          {converterContent.explanatory}
          
          {converterContent.tips.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Practical Tips</h3>
              <ul className="list-disc pl-6 space-y-1">
                {converterContent.tips.map((tip, idx) => (
                  <li key={idx}>{tip}</li>
                ))}
              </ul>
            </div>
          )}
          
          <p className="mt-4">
            For best results in your recipes, use a kitchen scale when possible. However, when you need to 
            convert between volume measurements, our converter provides accurate results based on standard 
            culinary measurements.
          </p>
        </div>
        
        <AdSlot position="mid-content" />
        
        <FAQ items={faqs} />
        
        <div className="mb-8">
          <Link
            href={`/ingredients/${ingredient}`}
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Learn more about {ingredientName} →
          </Link>
        </div>
        
        <RelatedTools tools={relatedTools} />
      </div>
    </>
  );
}
