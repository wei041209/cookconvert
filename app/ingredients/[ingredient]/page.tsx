import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ConversionTable from '@/components/ConversionTable';
import FAQ from '@/components/FAQ';
import RelatedTools from '@/components/RelatedTools';
import RelatedIngredientConversions from '@/components/RelatedIngredientConversions';
import PopularIngredients from '@/components/PopularIngredients';
import AdSlot from '@/components/AdSlot';
import JsonLd from '@/components/JsonLd';
import {
  INGREDIENTS,
  INGREDIENT_NAMES,
  INGREDIENT_DENSITIES,
  INGREDIENT_CONVERTERS,
} from '@/lib/registry';
import { formatNumber } from '@/lib/conversion';
import {
  generateBreadcrumbJsonLd,
  generateFAQJsonLd,
  generateArticleJsonLd,
  getRelatedTools,
} from '@/lib/utils';
import { normalizePathname } from '@/lib/path';
import { buildMetadata } from '@/lib/seo';

type Props = {
  params: {
    ingredient: string;
  };
};

export async function generateStaticParams() {
  return INGREDIENTS.map((ingredient) => ({
    ingredient,
  }));
}

function generateIngredientContent(ingredient: string): string {
  const ingredientName = INGREDIENT_NAMES[ingredient];
  const density = INGREDIENT_DENSITIES[ingredient];
  
  const contentMap: Record<string, string> = {
    'flour': `Flour is one of the most common ingredients in baking. All-purpose flour has a density of ${density} grams per cup. When measuring flour, it's important to use the correct method - spoon and level for accuracy. Packed flour can weigh significantly more, leading to dense baked goods.`,
    'sugar': `Granulated sugar is a staple in baking and cooking. With a density of ${density} grams per cup, sugar is denser than flour. When measuring sugar, you can scoop it directly from the container, as it doesn't compress like flour does.`,
    'brown-sugar': `Brown sugar has a higher density than white sugar at ${density} grams per cup due to its moisture content. When measuring brown sugar, it should be packed firmly into the measuring cup to ensure accuracy.`,
    'butter': `Butter has a density of ${density} grams per cup. One stick of butter equals 1/2 cup or 113.5 grams. Butter measurements are often marked on the wrapper, making it easy to measure.`,
    'milk': `Milk has a density of ${density} grams per cup. Whole milk, 2%, 1%, and skim milk all have slightly different densities, but for most recipes, ${density} grams per cup is a good approximation.`,
    'water': `Water has a density of ${density} grams per cup at room temperature. Water is the standard reference for volume measurements, and its density changes slightly with temperature.`,
    'honey': `Honey is one of the densest common ingredients at ${density} grams per cup. Its high density means that a cup of honey weighs significantly more than a cup of water. Honey should be measured at room temperature for accuracy.`,
    'olive-oil': `Olive oil has a density of ${density} grams per cup. Like other oils, olive oil is less dense than water. When measuring oil, use a liquid measuring cup for best results.`,
    'rice': `Uncooked rice has a density of ${density} grams per cup. Different types of rice (white, brown, jasmine, basmati) have slightly different densities, but ${density} grams per cup is a good average.`,
    'salt': `Salt has a high density of ${density} grams per cup. Table salt, kosher salt, and sea salt all have different densities due to their crystal sizes. This conversion uses table salt as the standard.`,
    'baking-powder': `Baking powder has a density of ${density} grams per cup. Baking powder is a leavening agent used in baking. It's important to measure it accurately, as too much or too little can affect the rise of baked goods.`,
    'cocoa-powder': `Cocoa powder has a relatively low density of ${density} grams per cup. Natural and Dutch-processed cocoa powders have similar densities. When measuring cocoa powder, spoon it into the measuring cup and level it off.`,
    'oats': `Oats have a low density of ${density} grams per cup. Rolled oats and quick oats have similar densities. Oats are often measured by volume in recipes, but weight measurements are more accurate.`,
    'yogurt': `Yogurt has a density of ${density} grams per cup. Greek yogurt is denser than regular yogurt due to its lower water content. This conversion uses regular yogurt as the standard.`,
    'cream': `Heavy cream has a density of ${density} grams per cup. Light cream and half-and-half have slightly different densities. For most recipes, ${density} grams per cup works well for heavy cream.`,
    'chopped-onion': `Chopped onion has a density of ${density} grams per cup. The density can vary based on how finely the onion is chopped. This conversion uses a medium chop as the standard.`,
    'shredded-cheese': `Shredded cheese has a density of ${density} grams per cup. The density can vary based on the type of cheese and how it's shredded. Packed shredded cheese will weigh more than loosely packed.`,
    'breadcrumbs': `Breadcrumbs have a density of ${density} grams per cup. The density varies based on whether the breadcrumbs are fresh, dry, or panko-style. This conversion uses dry breadcrumbs as the standard.`,
    'peanut-butter': `Peanut butter has a high density of ${density} grams per cup. Natural and processed peanut butters have similar densities. When measuring peanut butter, it's easier to measure by weight than volume.`,
    'jam': `Jam has a very high density of ${density} grams per cup due to its sugar content. The density can vary slightly based on the type of fruit and sugar content. This conversion provides a good average.`,
  };
  
  return contentMap[ingredient] || `${ingredientName} has a density of ${density} grams per cup.`;
}

function generateTableData(ingredient: string) {
  const density = INGREDIENT_DENSITIES[ingredient];
  const data: (string | number)[][] = [];
  
  // Cups to grams table
  for (let i = 0.25; i <= 2; i += 0.25) {
    const grams = i * density;
    data.push([formatNumber(i), formatNumber(grams)]);
  }
  
  return data;
}

function generateFAQs(ingredient: string) {
  const ingredientName = INGREDIENT_NAMES[ingredient];
  const density = INGREDIENT_DENSITIES[ingredient];
  
  return [
    {
      question: `What is the density of ${ingredientName}?`,
      answer: `${ingredientName} has a density of ${density} grams per cup. This means that one cup of ${ingredientName} weighs ${density} grams.`,
    },
    {
      question: `How do I convert cups to grams for ${ingredientName}?`,
      answer: `To convert cups to grams for ${ingredientName}, multiply the number of cups by ${density}. For example, 2 cups of ${ingredientName} equals ${2 * density} grams. You can use our converter tools for instant results.`,
    },
    {
      question: `Why is the density important for ${ingredientName}?`,
      answer: `Understanding the density of ${ingredientName} is crucial for accurate recipe conversions. Different ingredients have different densities, so using the correct density ensures your conversions are accurate.`,
    },
    {
      question: `Can I use volume measurements for ${ingredientName}?`,
      answer: `While volume measurements work for ${ingredientName}, weight measurements are more accurate, especially in baking. A kitchen scale provides the most precise measurements.`,
    },
    {
      question: `Does the density of ${ingredientName} vary?`,
      answer: `The density of ${ingredientName} can vary slightly based on factors like temperature, packing method, and brand. The value of ${density} grams per cup is a standard average used in most recipes.`,
    },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ingredient } = params;
  
  if (!INGREDIENTS.includes(ingredient as any)) {
    notFound();
  }
  
  const ingredientName = INGREDIENT_NAMES[ingredient];
  const density = INGREDIENT_DENSITIES[ingredient];
  
  return buildMetadata({
    pageTitle: `${ingredientName} — Density, Conversion Chart & Cooking Tips`,
    description: `${ingredientName}: density ${density} g/cup, cups-to-grams table, and measuring tips for baking and cooking.`,
    pathname: `/ingredients/${ingredient}`,
  });
}

export default function IngredientPage({ params }: Props) {
  const { ingredient } = params;
  
  if (!INGREDIENTS.includes(ingredient as any)) {
    notFound();
  }
  
  const ingredientName = INGREDIENT_NAMES[ingredient];
  const density = INGREDIENT_DENSITIES[ingredient];
  const tableData = generateTableData(ingredient);
  const faqs = generateFAQs(ingredient);
  const content = generateIngredientContent(ingredient);
  
  const relatedTools = INGREDIENT_CONVERTERS.map((converter) => ({
    title: `${converter.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} - ${ingredientName}`,
    href: `/${converter}/${ingredient}`,
  }));
  
  const breadcrumbs = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Ingredients', url: '/ingredients' },
    { name: ingredientName, url: `/ingredients/${ingredient}` },
  ]);
  
  const faqJsonLd = generateFAQJsonLd(faqs);
  
  // Article schema for E-E-A-T signals
  const buildDate = process.env.NEXT_PUBLIC_BUILD_TIME 
    ? new Date(process.env.NEXT_PUBLIC_BUILD_TIME).toISOString()
    : new Date().toISOString();
  const articleJsonLd = generateArticleJsonLd({
    title: `${ingredientName} - Cooking Ingredient Guide`,
    description: `Learn about ${ingredientName}, its density (${density} grams per cup), and conversion tips. Free cooking ingredient guide with conversion tools`,
    url: normalizePathname(`/ingredients/${ingredient}`),
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
          <Link href="/ingredients" className="hover:text-primary-600">Ingredients</Link>
          {' / '}
          <span className="text-gray-900">{ingredientName}</span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-6">{ingredientName} - Cooking Ingredient Guide</h1>

        <div className="prose max-w-none text-gray-700 mb-8">
          <p className="text-xl text-gray-600 mb-4">
            {ingredientName} has a density of <strong>{density} grams per cup</strong>. This guide provides 
            information about {ingredientName}, its density, and how to convert between different measurement units.
          </p>
          <p>{content}</p>
          <p>
            When working with {ingredientName} in recipes, it's important to use accurate measurements. 
            Weight measurements (grams) are generally more accurate than volume measurements (cups), especially 
            in baking where precision matters.
          </p>
          <p>
            Our conversion tools allow you to convert between cups, grams, and tablespoons for {ingredientName}. 
            Simply select the conversion type you need and enter your measurement for instant results.
          </p>
          <p>
            Understanding the density of {ingredientName} helps you make accurate conversions and ensures your 
            recipes turn out as expected. Whether you're scaling a recipe up or down, or converting between 
            measurement systems, our tools make it easy.
          </p>
        </div>

        <ConversionTable
          title={`${ingredientName} - Cups to Grams Conversion Table`}
          headers={['Cups', 'Grams']}
          rows={tableData}
        />

        <AdSlot position="mid-content" />

        <RelatedIngredientConversions ingredient={ingredient} />

        <div className="prose max-w-none text-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Tips for Measuring {ingredientName}</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use a kitchen scale for the most accurate measurements, especially in baking</li>
            <li>When using volume measurements, use the appropriate measuring cups (dry for dry ingredients, liquid for liquids)</li>
            <li>For dry ingredients like {ingredientName}, spoon into the measuring cup and level off with a straight edge</li>
            <li>For sticky ingredients, lightly grease the measuring cup or use weight measurements</li>
            <li>Always use the same measurement system throughout a recipe for consistency</li>
          </ul>
        </div>

        <FAQ items={faqs} />

        <PopularIngredients excludeIngredient={ingredient} maxItems={12} />

        <RelatedTools tools={relatedTools} />
      </div>
    </>
  );
}

