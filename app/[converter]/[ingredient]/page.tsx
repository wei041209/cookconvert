import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import ConversionTable from '@/components/ConversionTable';
import EEATSection from '@/components/EEATSection';
import PopularIngredients from '@/components/PopularIngredients';
import AdSlot from '@/components/AdSlot';
import JsonLd from '@/components/JsonLd';

// Lazy load below-the-fold components for better performance
const Converter = dynamic(() => import('@/components/Converter'), {
  ssr: true, // Keep SSR for SEO, but lazy load for bundle splitting
});

const FAQ = dynamic(() => import('@/components/FAQ'), {
  ssr: true,
});

const RelatedConversions = dynamic(() => import('@/components/RelatedConversions'), {
  ssr: true,
});
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
  generateArticleJsonLd,
  getRelatedConversions,
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

/**
 * Generate unique "Why Density Matters" content based on ingredient characteristics
 */
function generateWhyDensityMatters(ingredient: string, ingredientName: string, density: number, converter: string) {
  const isFlour = ingredient.includes('flour');
  const isSugar = ingredient.includes('sugar') || ingredient.includes('syrup') || ingredient === 'honey' || ingredient === 'molasses';
  const isDairy = ['milk', 'cream', 'yogurt', 'butter', 'cheese'].some(d => ingredient.includes(d));
  const isOil = ingredient.includes('oil') || ingredient === 'butter' || ingredient === 'shortening' || ingredient === 'lard';
  const isLiquid = ['milk', 'water', 'broth', 'stock'].some(l => ingredient.includes(l));
  const units = getUnits(converter);
  
  let content = '';
  
  if (isFlour) {
    content = `Understanding density is crucial when working with ${ingredientName} because flour can be packed to different degrees. A cup of ${ingredientName} that's scooped directly from the bag can weigh up to 50% more than a properly spooned and leveled cup. This density variation is why professional bakers always use weight measurements (grams) for ${ingredientName} - it eliminates the guesswork and ensures consistent results every time.`;
  } else if (isSugar) {
    content = `Density matters significantly for ${ingredientName} because ${ingredient.includes('brown-sugar') ? 'brown sugar is typically packed when measured, which increases its density' : 'different types of sugar have different densities'}. When converting ${units.from.toLowerCase()} to ${units.to.toLowerCase()} for ${ingredientName}, using the correct density ensures your recipes have the right sweetness and texture. Too much ${ingredientName} can make baked goods overly sweet or dense, while too little can result in flat, bland results.`;
  } else if (isDairy) {
    content = `The density of ${ingredientName} is important because dairy products can vary in consistency. ${ingredient.includes('cream') ? 'Heavy cream and light cream have different fat contents, which affects their density.' : ingredient.includes('cheese') ? 'Different types of cheese have varying densities based on moisture content and aging.' : 'Temperature can also affect the density of dairy products.'} When converting ${units.from.toLowerCase()} to ${units.to.toLowerCase()} for ${ingredientName}, using the precise density ensures accurate recipe scaling and consistent results.`;
  } else if (isOil) {
    content = `Density is essential for ${ingredientName} conversions because oils are less dense than water, and different oils have slightly different densities. When converting ${units.from.toLowerCase()} to ${units.to.toLowerCase()} for ${ingredientName}, the density value accounts for the oil's specific gravity. This is particularly important in baking, where fat content affects texture and moisture. Using the correct density ensures your ${ingredientName} measurements contribute the right amount of fat to your recipes.`;
  } else if (isLiquid) {
    content = `While ${ingredientName} has a relatively consistent density, understanding this value is still important for accurate conversions. When converting ${units.from.toLowerCase()} to ${units.to.toLowerCase()} for ${ingredientName}, the density ensures you're using the correct volume-to-weight ratio. This is especially useful when scaling recipes or converting between measurement systems. Temperature can slightly affect ${ingredientName}'s density, but for most cooking applications, the standard density value provides excellent accuracy.`;
  } else {
    const densityDescription = density > 200 
      ? 'is denser than many ingredients' 
      : density < 150 
        ? 'is lighter than many ingredients' 
        : 'has a moderate density';
    content = `Density is a fundamental property that determines how much ${ingredientName} fits in a given volume. With a density of ${density} grams per cup, ${ingredientName} ${densityDescription}. When converting ${units.from.toLowerCase()} to ${units.to.toLowerCase()} for ${ingredientName}, using the precise density ensures your measurements are accurate. This is particularly important in baking, where even small measurement errors can significantly affect the final product.`;
  }
  
  return content;
}

/**
 * Generate unique "Common Cooking Mistakes" content based on ingredient and converter type
 */
function generateCommonMistakes(ingredient: string, ingredientName: string, density: number, converter: string) {
  const isFlour = ingredient.includes('flour');
  const isSugar = ingredient.includes('sugar') || ingredient.includes('syrup') || ingredient === 'honey' || ingredient === 'molasses';
  const isDairy = ['milk', 'cream', 'yogurt', 'butter', 'cheese'].some(d => ingredient.includes(d));
  const isOil = ingredient.includes('oil') || ingredient === 'butter' || ingredient === 'shortening' || ingredient === 'lard';
  const units = getUnits(converter);
  
  const mistakes: string[] = [];
  
  if (converter === 'cups-to-grams') {
    if (isFlour) {
      mistakes.push(
        `Scooping ${ingredientName} directly from the container packs it too tightly, resulting in up to 30% more weight than intended`,
        `Tapping or shaking the measuring cup after filling compacts ${ingredientName}, leading to inaccurate measurements`,
        `Using a liquid measuring cup for ${ingredientName} makes it difficult to level properly, causing measurement errors`
      );
    } else if (isSugar) {
      mistakes.push(
        `${ingredient.includes('brown-sugar') ? 'Not packing brown sugar firmly enough' : 'Packing granulated sugar too tightly'} when measuring, which ${ingredient.includes('brown-sugar') ? 'results in less sugar than the recipe requires' : 'adds too much sugar to recipes'}`,
        `Using volume measurements for ${ingredientName} in critical baking recipes instead of weight measurements`,
        `Assuming all sugars have the same density, leading to incorrect conversions between different sugar types`
      );
    } else if (isDairy) {
      mistakes.push(
        `Measuring ${ingredientName} at the wrong temperature, as cold ${ingredientName} takes up less volume than room temperature ${ingredientName}`,
        `Using dry measuring cups for liquid ${ingredientName}, which makes it difficult to read the measurement line accurately`,
        `Not accounting for ${ingredient.includes('cream') ? 'fat content variations' : 'moisture content'} when converting ${ingredientName} measurements`
      );
    } else {
      mistakes.push(
        `Not leveling off ${ingredientName} properly, which can add 10-15% more ingredient than intended`,
        `Using the wrong type of measuring cup (dry vs. liquid) for ${ingredientName}, leading to inaccurate volume measurements`,
        `Assuming all ingredients have the same density, which causes significant errors when converting ${ingredientName}`
      );
    }
  } else if (converter === 'grams-to-cups') {
    mistakes.push(
      `Rounding ${ingredientName} measurements too aggressively, which accumulates errors in recipes with multiple ingredients`,
      `Not using a kitchen scale to measure grams, instead trying to estimate weight from volume measurements`,
      `Converting ${ingredientName} without considering that the result may need practical rounding (e.g., 0.47 cups to 0.5 cups)`
    );
  } else if (converter === 'tbsp-to-grams') {
    mistakes.push(
      `Using regular eating spoons instead of proper measuring spoons for ${ingredientName}, which can vary by 20-30%`,
      `Not leveling off the tablespoon of ${ingredientName}, leaving it heaped or rounded, which adds extra weight`,
      `Assuming all tablespoons are the same size worldwide, when US, UK, and Australian tablespoons differ significantly`
    );
  }
  
  // Add ingredient-specific mistakes
  if (isFlour) {
    mistakes.push(`Sifting ${ingredientName} after measuring instead of before, which changes the volume and weight relationship`);
  } else if (isSugar && ingredient.includes('brown-sugar')) {
    mistakes.push(`Not packing brown sugar firmly enough, resulting in less sugar and affecting both sweetness and moisture in baked goods`);
  } else if (isOil) {
    mistakes.push(`Measuring ${ingredientName} when it's too cold, which makes it more viscous and affects the volume measurement`);
  }
  
  return mistakes.slice(0, 4); // Return top 4 mistakes
}

/**
 * Generate enhanced measurement tips based on ingredient type
 */
function generateMeasurementTips(ingredient: string, ingredientName: string, density: number, converter: string) {
  const isFlour = ingredient.includes('flour');
  const isSugar = ingredient.includes('sugar') || ingredient.includes('syrup') || ingredient === 'honey' || ingredient === 'molasses';
  const isDairy = ['milk', 'cream', 'yogurt', 'butter', 'cheese'].some(d => ingredient.includes(d));
  const isOil = ingredient.includes('oil') || ingredient === 'butter' || ingredient === 'shortening' || ingredient === 'lard';
  const isLiquid = ['milk', 'water', 'broth', 'stock'].some(l => ingredient.includes(l));
  const units = getUnits(converter);
  
  const tips: string[] = [];
  
  if (converter === 'cups-to-grams') {
    if (isFlour) {
      tips.push(
        `Always spoon ${ingredientName} into the measuring cup rather than scooping, as scooping can pack up to 30% more flour`,
        `Use a straight edge (like a butter knife) to level off ${ingredientName} at the rim of the measuring cup for consistent measurements`,
        `For the most accurate ${ingredientName} measurements, use a kitchen scale to measure grams directly`,
        `Sift ${ingredientName} before measuring if your recipe calls for sifted flour, as this affects the density`
      );
    } else if (isSugar) {
      tips.push(
        `${ingredient.includes('brown-sugar') ? 'Pack brown sugar firmly' : 'Pour granulated sugar'} into the measuring cup ${ingredient.includes('brown-sugar') ? 'until it holds its shape when inverted' : 'and level it off'}`,
        `Use dry measuring cups for ${ingredientName}, not liquid measuring cups, for more accurate volume measurements`,
        `For critical baking recipes, measure ${ingredientName} by weight (grams) using a kitchen scale for precision`,
        `Store ${ingredientName} in an airtight container to prevent clumping, which can affect measurement accuracy`
      );
    } else if (isDairy || isLiquid) {
      tips.push(
        `Use liquid measuring cups for ${ingredientName}, placed on a flat surface, and read the measurement at eye level`,
        `Measure ${ingredientName} at room temperature when possible, as temperature affects volume slightly`,
        `For sticky ${ingredientName} like honey or syrup, lightly grease the measuring cup first for easier pouring`,
        `When measuring ${ingredientName} by weight, ensure your scale is calibrated and on a level surface`
      );
    } else {
      tips.push(
        `Use the appropriate measuring tool for ${ingredientName}: dry cups for dry ingredients, liquid cups for liquids`,
        `Level off ${ingredientName} with a straight edge to ensure you're not adding extra weight to your measurements`,
        `For best accuracy with ${ingredientName}, use a kitchen scale to measure grams directly`,
        `Store ${ingredientName} properly to maintain consistent density - moisture and temperature can affect measurements`
      );
    }
  } else if (converter === 'grams-to-cups') {
    tips.push(
      `Use a digital kitchen scale to measure ${ingredientName} in grams for the most accurate starting point`,
      `Round the converted cup value to practical measurements (0.25, 0.5, 0.75, 1 cup) for easier recipe following`,
      `For ${ingredientName}, remember that the conversion assumes a properly leveled cup measurement`,
      `When scaling recipes, convert all ingredients to grams first, then scale proportionally for best results`
    );
  } else if (converter === 'tbsp-to-grams') {
    tips.push(
      `Use proper measuring spoons for ${ingredientName}, not regular eating utensils, as sizes vary significantly`,
      `Level off the tablespoon of ${ingredientName} with a straight edge to ensure consistent volume`,
      `For small amounts of ${ingredientName}, a kitchen scale provides better precision than volume measurements`,
      `Remember that US tablespoons (14.79 ml) differ from UK (17.76 ml) and Australian (20 ml) tablespoons`
    );
  }
  
  return tips.slice(0, 5); // Return top 5 tips
}

function generateFAQs(converter: string, ingredient: string) {
  const ingredientName = INGREDIENT_NAMES[ingredient];
  const density = INGREDIENT_DENSITIES[ingredient];
  
  // Determine ingredient category for more specific FAQs
  const isFlour = ingredient.includes('flour');
  const isSugar = ingredient.includes('sugar') || ingredient.includes('syrup') || ingredient === 'honey' || ingredient === 'molasses';
  const isDairy = ['milk', 'cream', 'yogurt', 'butter', 'cheese'].some(d => ingredient.includes(d));
  const isOil = ingredient.includes('oil') || ingredient === 'butter' || ingredient === 'shortening' || ingredient === 'lard';
  const isLiquid = ['milk', 'water', 'broth', 'stock'].some(l => ingredient.includes(l));
  
  const faqs: { question: string; answer: string }[] = [];
  
  // Generate converter-specific long-tail questions
  if (converter === 'grams-to-cups') {
    // Question 1: Specific gram amount to cups
    const commonGrams = [50, 100, 150, 200, 250, 300, 500];
    const selectedGrams = commonGrams.find(g => g < density * 2) || 200;
    const cupsResult = gramsToCups(selectedGrams, ingredient);
    const cupsFormatted = formatNumber(cupsResult);
    
    faqs.push({
      question: `How many cups is ${selectedGrams} grams of ${ingredientName}?`,
      answer: `${selectedGrams} grams of ${ingredientName} equals approximately ${cupsFormatted} ${cupsResult === 1 ? 'cup' : 'cups'}. To convert grams to cups for ${ingredientName}, divide the number of grams by ${density} (the density of ${ingredientName} in grams per cup). This conversion is essential when following recipes that use weight measurements, especially in professional baking where precision matters.`,
    });
    
    // Question 2: Half cup equivalence
    const halfCupGrams = Math.round(density * 0.5);
    faqs.push({
      question: `Is ${halfCupGrams} grams of ${ingredientName} equal to half a cup?`,
      answer: `Yes, ${halfCupGrams} grams of ${ingredientName} equals exactly half a cup (0.5 cups). Since ${ingredientName} has a density of ${density} grams per cup, half a cup weighs ${halfCupGrams} grams. This conversion is useful when you need to halve a recipe or when your kitchen scale shows ${halfCupGrams} grams and you want to know the equivalent volume measurement.`,
    });
    
    // Question 3: How to convert grams to cups
    faqs.push({
      question: `How do I convert grams to cups for ${ingredientName}?`,
      answer: `To convert grams to cups for ${ingredientName}, divide the number of grams by ${density} (the density of ${ingredientName}). For example, if you have ${density * 2} grams of ${ingredientName}, divide by ${density} to get 2 cups. You can use our converter tool above for instant, accurate conversions, or use a kitchen scale to measure grams first, then convert to cups using this formula.`,
    });
    
    // Question 4: Why density matters
    faqs.push({
      question: `Why does ${ingredientName} conversion depend on density?`,
      answer: `${ingredientName} conversion depends on density because different ingredients have different weights for the same volume. ${ingredientName} has a density of ${density} grams per cup, which means one cup weighs ${density} grams. Without knowing this specific density value, you can't accurately convert between grams and cups. This is why ingredient-specific converters like ours are essential for accurate recipe conversions.`,
    });
    
    // Question 5: Specific cup amount in grams
    faqs.push({
      question: `How many grams are in 1 cup of ${ingredientName}?`,
      answer: `One cup of ${ingredientName} weighs ${density} grams. This density value is based on standard culinary measurements and ensures accurate conversions for your recipes. When converting from cups to grams, simply multiply the number of cups by ${density} to get the total weight in grams.`,
    });
    
    // Question 6: Density value
    faqs.push({
      question: `What is the density of ${ingredientName}?`,
      answer: `The density of ${ingredientName} is ${density} grams per cup. ${density > 250 ? `This makes ${ingredientName} a relatively dense ingredient, similar to ingredients like honey or condensed milk.` : density < 150 ? `This makes ${ingredientName} a relatively light ingredient, similar to ingredients like flour or oats.` : `This density is typical for ${isDairy ? 'dairy products' : isFlour ? 'flour-based ingredients' : 'common cooking ingredients'}.`} Understanding this density is crucial for accurate conversions between weight and volume measurements.`,
    });
    
    // Question 7: Comparison with other ingredients
    const comparisonIngredient = density > 200 ? (isSugar ? 'flour' : 'honey') : (isFlour ? 'honey' : 'flour');
    const comparisonDensity = comparisonIngredient === 'flour' ? 120 : comparisonIngredient === 'honey' ? 340 : 200;
    const isHeavier = density > comparisonDensity;
    
    faqs.push({
      question: `Is ${ingredientName} heavier than ${comparisonIngredient}?`,
      answer: `${isHeavier ? 'Yes' : 'No'}, ${ingredientName} is ${isHeavier ? 'heavier' : 'lighter'} than ${comparisonIngredient}. ${ingredientName} has a density of ${density} grams per cup, while ${comparisonIngredient} has a density of ${comparisonDensity} grams per cup. This means that one cup of ${ingredientName} weighs ${Math.abs(density - comparisonDensity)} grams ${isHeavier ? 'more' : 'less'} than one cup of ${comparisonIngredient}. This difference is why ingredient-specific converters are essential for accurate recipe conversions.`,
    });
    
    // Question 8: Measuring cup vs scale
    faqs.push({
      question: `Can I use a measuring cup instead of a scale for ${ingredientName}?`,
      answer: `While you can use a measuring cup for ${ingredientName}, a kitchen scale provides more accurate results, especially for baking. Measuring cups can vary by 10-20% depending on how you pack or level the ingredient. ${isDairy ? 'For liquid ingredients like ' + ingredientName + ', use a liquid measuring cup placed on a flat surface and read at eye level.' : isFlour ? 'For ' + ingredientName + ', always use the spoon-and-level method rather than scooping directly from the container.' : 'For best accuracy, use a digital kitchen scale to measure grams, then convert to cups if needed.'} Our converter helps you convert between these measurement methods accurately.`,
    });
    
  } else if (converter === 'cups-to-grams') {
    // Question 1: Specific cup amount to grams
    faqs.push({
      question: `How many grams are in a cup of ${ingredientName}?`,
      answer: `One cup of ${ingredientName} equals ${density} grams. To convert cups to grams for ${ingredientName}, multiply the number of cups by ${density}. For example, 2 cups of ${ingredientName} equals ${2 * density} grams. ${isFlour ? 'For accurate measurements, spoon the flour into the measuring cup and level it off with a straight edge.' : isDairy ? 'Make sure to use liquid measuring cups for accurate volume measurements.' : 'Use our converter above for instant, accurate conversions.'}`,
    });
    
    // Question 2: Half cup in grams
    const halfCupGrams = Math.round(density * 0.5);
    faqs.push({
      question: `How many grams is half a cup of ${ingredientName}?`,
      answer: `Half a cup (0.5 cups) of ${ingredientName} weighs ${halfCupGrams} grams. Since ${ingredientName} has a density of ${density} grams per cup, half a cup is simply ${density} divided by 2, which equals ${halfCupGrams} grams. This conversion is useful when halving recipes or when you need a smaller amount of ${ingredientName} for your cooking or baking.`,
    });
    
    // Question 3: How to convert cups to grams
    faqs.push({
      question: `How do I convert cups to grams for ${ingredientName}?`,
      answer: `To convert cups to grams for ${ingredientName}, multiply the number of cups by ${density} (the density of ${ingredientName} in grams per cup). For example, if you have 1.5 cups of ${ingredientName}, multiply 1.5 by ${density} to get ${Math.round(density * 1.5)} grams. You can use our converter tool above for instant, accurate conversions, or use this formula for manual calculations.`,
    });
    
    // Question 4: Why density matters
    faqs.push({
      question: `Why does ${ingredientName} conversion depend on density?`,
      answer: `${ingredientName} conversion depends on density because different ingredients have different weights for the same volume. ${ingredientName} has a density of ${density} grams per cup, which means one cup weighs ${density} grams. Without knowing this specific density value, you can't accurately convert between cups and grams. This is why ingredient-specific converters like ours are essential for accurate recipe conversions.`,
    });
    
    // Question 5: Specific gram amount (reverse)
    const commonCups = [0.25, 0.5, 0.75, 1, 1.5, 2];
    const selectedCups = commonCups.find(c => c * density < 500) || 1;
    const gramsResult = Math.round(cupsToGrams(selectedCups, ingredient));
    
    faqs.push({
      question: `How many grams is ${formatNumber(selectedCups)} ${selectedCups === 1 ? 'cup' : 'cups'} of ${ingredientName}?`,
      answer: `${formatNumber(selectedCups)} ${selectedCups === 1 ? 'cup' : 'cups'} of ${ingredientName} equals ${gramsResult} grams. To calculate this, multiply ${formatNumber(selectedCups)} by ${density} (the density of ${ingredientName}). This conversion is essential when following recipes that use weight measurements or when you need to scale a recipe up or down.`,
    });
    
    // Question 6: Density value
    faqs.push({
      question: `What is the density of ${ingredientName}?`,
      answer: `The density of ${ingredientName} is ${density} grams per cup. ${density > 250 ? `This makes ${ingredientName} a relatively dense ingredient, similar to ingredients like honey or condensed milk.` : density < 150 ? `This makes ${ingredientName} a relatively light ingredient, similar to ingredients like flour or oats.` : `This density is typical for ${isDairy ? 'dairy products' : isFlour ? 'flour-based ingredients' : 'common cooking ingredients'}.`} Understanding this density is crucial for accurate conversions between volume and weight measurements.`,
    });
    
    // Question 7: Comparison with other ingredients
    const comparisonIngredient = density > 200 ? (isSugar ? 'flour' : 'honey') : (isFlour ? 'honey' : 'flour');
    const comparisonDensity = comparisonIngredient === 'flour' ? 120 : comparisonIngredient === 'honey' ? 340 : 200;
    const isHeavier = density > comparisonDensity;
    
    faqs.push({
      question: `Is ${ingredientName} heavier than ${comparisonIngredient}?`,
      answer: `${isHeavier ? 'Yes' : 'No'}, ${ingredientName} is ${isHeavier ? 'heavier' : 'lighter'} than ${comparisonIngredient}. ${ingredientName} has a density of ${density} grams per cup, while ${comparisonIngredient} has a density of ${comparisonDensity} grams per cup. This means that one cup of ${ingredientName} weighs ${Math.abs(density - comparisonDensity)} grams ${isHeavier ? 'more' : 'less'} than one cup of ${comparisonIngredient}. This difference is why ingredient-specific converters are essential for accurate recipe conversions.`,
    });
    
    // Question 8: Measuring cup vs scale
    faqs.push({
      question: `Can I use a measuring cup instead of a scale for ${ingredientName}?`,
      answer: `While you can use a measuring cup for ${ingredientName}, a kitchen scale provides more accurate results, especially for baking. Measuring cups can vary by 10-20% depending on how you pack or level the ingredient. ${isDairy ? 'For liquid ingredients like ' + ingredientName + ', use a liquid measuring cup placed on a flat surface and read at eye level.' : isFlour ? 'For ' + ingredientName + ', always use the spoon-and-level method rather than scooping directly from the container.' : 'For best accuracy, use a digital kitchen scale to measure grams, then convert to cups if needed.'} Our converter helps you convert between these measurement methods accurately.`,
    });
    
  } else if (converter === 'tbsp-to-grams') {
    const tbspGrams = density / 16;
    const tbspGramsFormatted = formatNumber(tbspGrams);
    
    // Question 1: Tablespoon to grams
    faqs.push({
      question: `How many grams are in a tablespoon of ${ingredientName}?`,
      answer: `One tablespoon of ${ingredientName} weighs approximately ${tbspGramsFormatted} grams. Since there are 16 tablespoons in one cup, and ${ingredientName} has a density of ${density} grams per cup, each tablespoon equals ${tbspGramsFormatted} grams. ${isOil ? 'For oils, make sure to use a proper measuring spoon and level it off.' : 'Use our converter above for instant, accurate conversions.'}`,
    });
    
    // Question 2: Multiple tablespoons
    const tbspAmount = 4;
    const gramsResult = Math.round(tbspToGrams(tbspAmount, ingredient));
    faqs.push({
      question: `How many grams is ${tbspAmount} tablespoons of ${ingredientName}?`,
      answer: `${tbspAmount} tablespoons of ${ingredientName} equals ${gramsResult} grams. To calculate this, multiply ${tbspAmount} by ${tbspGramsFormatted} (the weight of one tablespoon). This conversion is useful when recipes call for multiple tablespoons and you need to know the total weight in grams for accurate measurement.`,
    });
    
    // Question 3: How to convert tablespoons to grams
    faqs.push({
      question: `How do I convert tablespoons to grams for ${ingredientName}?`,
      answer: `To convert tablespoons to grams for ${ingredientName}, multiply the number of tablespoons by ${tbspGramsFormatted} (the weight of one tablespoon of ${ingredientName}). Since ${ingredientName} has a density of ${density} grams per cup and there are 16 tablespoons in a cup, each tablespoon weighs ${tbspGramsFormatted} grams. You can use our converter tool above for instant, accurate conversions.`,
    });
    
    // Question 4: Why density matters
    faqs.push({
      question: `Why does ${ingredientName} conversion depend on density?`,
      answer: `${ingredientName} conversion depends on density because different ingredients have different weights for the same volume. ${ingredientName} has a density of ${density} grams per cup, which means one tablespoon weighs ${tbspGramsFormatted} grams. Without knowing this specific density value, you can't accurately convert between tablespoons and grams. This is why ingredient-specific converters like ours are essential for accurate recipe conversions.`,
    });
    
    // Question 5: Cups to tablespoons relationship
    faqs.push({
      question: `How many grams are in 1 cup of ${ingredientName}?`,
      answer: `One cup of ${ingredientName} weighs ${density} grams. Since there are 16 tablespoons in one cup, and ${ingredientName} has a density of ${density} grams per cup, each tablespoon equals ${tbspGramsFormatted} grams. This relationship allows you to convert between any volume measurement (cups, tablespoons, teaspoons) and weight (grams) for ${ingredientName}.`,
    });
    
    // Question 6: Density value
    faqs.push({
      question: `What is the density of ${ingredientName}?`,
      answer: `The density of ${ingredientName} is ${density} grams per cup. ${density > 250 ? `This makes ${ingredientName} a relatively dense ingredient, similar to ingredients like honey or condensed milk.` : density < 150 ? `This makes ${ingredientName} a relatively light ingredient, similar to ingredients like flour or oats.` : `This density is typical for ${isDairy ? 'dairy products' : isFlour ? 'flour-based ingredients' : 'common cooking ingredients'}.`} Understanding this density is crucial for accurate conversions between volume and weight measurements.`,
    });
    
    // Question 7: Comparison with other ingredients
    const comparisonIngredient = density > 200 ? (isSugar ? 'flour' : 'honey') : (isFlour ? 'honey' : 'flour');
    const comparisonDensity = comparisonIngredient === 'flour' ? 120 : comparisonIngredient === 'honey' ? 340 : 200;
    const comparisonTbspGrams = formatNumber(comparisonDensity / 16);
    const isHeavier = density > comparisonDensity;
    
    faqs.push({
      question: `Is ${ingredientName} heavier than ${comparisonIngredient}?`,
      answer: `${isHeavier ? 'Yes' : 'No'}, ${ingredientName} is ${isHeavier ? 'heavier' : 'lighter'} than ${comparisonIngredient}. One tablespoon of ${ingredientName} weighs ${tbspGramsFormatted} grams, while one tablespoon of ${comparisonIngredient} weighs ${comparisonTbspGrams} grams. This difference means that ${ingredientName} is ${isHeavier ? 'denser' : 'less dense'} than ${comparisonIngredient}, which is why ingredient-specific converters are essential for accurate recipe conversions.`,
    });
    
    // Question 8: Measuring spoon vs scale
    faqs.push({
      question: `Can I use a measuring spoon instead of a scale for ${ingredientName}?`,
      answer: `While you can use a measuring spoon for ${ingredientName}, a kitchen scale provides more accurate results, especially for small amounts. Measuring spoons can vary by 10-20% depending on how you level or pack the ingredient. ${isOil ? 'For oils, use a proper measuring spoon and level it off with a straight edge.' : isFlour ? 'For ' + ingredientName + ', always level off the spoon with a straight edge rather than leaving it heaped.' : 'For best accuracy with small amounts, use a digital kitchen scale that measures to 0.1 grams.'} Our converter helps you convert between these measurement methods accurately.`,
    });
  }
  
  // Ensure we have at least 8 FAQs
  return faqs.slice(0, 8);
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
  const relatedConversions = getRelatedConversions(normalizedPath, ingredient);
  const quickValues = getQuickValues(converter);
  const converterContent = getConverterSpecificContent(converter, ingredientName);
  const whyDensityMatters = generateWhyDensityMatters(ingredient, ingredientName, density, converter);
  const commonMistakes = generateCommonMistakes(ingredient, ingredientName, density, converter);
  const measurementTips = generateMeasurementTips(ingredient, ingredientName, density, converter);
  
  const breadcrumbs = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: ingredientName, url: `/${converter}/${ingredient}` },
  ]);
  
  const faqJsonLd = generateFAQJsonLd(faqs);
  
  // Article schema for E-E-A-T
  const buildDate = process.env.NEXT_PUBLIC_BUILD_TIME 
    ? new Date(process.env.NEXT_PUBLIC_BUILD_TIME).toISOString()
    : new Date().toISOString();
  const articleJsonLd = generateArticleJsonLd({
    title: title,
    description: `Convert ${units.from.toLowerCase()} to ${units.to.toLowerCase()} for ${ingredientName}. Free, instant cooking measurement converter with accurate density values`,
    url: normalizedPath,
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

        <div className="prose max-w-none text-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Density Matters for {ingredientName}</h2>
          <p>
            {whyDensityMatters}
          </p>
          <p>
            The density of {ingredientName} ({density} grams per cup) is not just a number - it's a critical 
            factor that determines how much {ingredientName} you're actually using in your recipes. When you 
            convert {units.from.toLowerCase()} to {units.to.toLowerCase()} for {ingredientName}, this density 
            value ensures that your measurements are accurate and your recipes turn out as intended.
          </p>
          <p>
            Professional chefs and bakers understand that density variations can make or break a recipe. 
            Using a generic conversion factor for {ingredientName} instead of its specific density can lead 
            to significant measurement errors, especially when scaling recipes up or down. Our converter uses 
            the precise density for {ingredientName}, giving you the accuracy you need for successful cooking 
            and baking.
          </p>
        </div>

        <div className="prose max-w-none text-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Cooking Mistakes When Converting {ingredientName}</h2>
          <p>
            Many home cooks make mistakes when converting {units.from.toLowerCase()} to {units.to.toLowerCase()} 
            for {ingredientName}. These errors can significantly impact your recipes, especially in baking where 
            precision is crucial. Here are the most common mistakes to avoid:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            {commonMistakes.map((mistake, idx) => (
              <li key={idx} className="text-gray-700">{mistake}</li>
            ))}
          </ul>
          <p className="mt-4">
            By using our {ingredientName} converter and following proper measurement techniques, you can avoid 
            these common mistakes and achieve consistent, accurate results in all your recipes. Remember that 
            when converting {units.from.toLowerCase()} to {units.to.toLowerCase()} for {ingredientName}, 
            precision matters - small errors can compound and significantly affect your final dish.
          </p>
        </div>

        <div className="prose max-w-none text-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Measurement Tips for {ingredientName}</h2>
          <p>
            Getting accurate measurements when converting {units.from.toLowerCase()} to {units.to.toLowerCase()} 
            for {ingredientName} requires the right techniques and tools. Here are expert tips to ensure your 
            {ingredientName} measurements are precise:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4">
            {measurementTips.map((tip, idx) => (
              <li key={idx} className="text-gray-700">{tip}</li>
            ))}
          </ul>
          <p className="mt-4">
            Following these measurement tips for {ingredientName} will help you achieve consistent results 
            when converting {units.from.toLowerCase()} to {units.to.toLowerCase()}. Whether you're baking a 
            cake, making bread, or preparing any recipe that uses {ingredientName}, accurate measurements are 
            the foundation of culinary success. Our converter makes it easy to get precise conversions, but 
            proper measuring techniques ensure those conversions translate to perfect results in your kitchen.
          </p>
        </div>
        
        <AdSlot position="mid-content" />
        
        <FAQ items={faqs} />
        
        <EEATSection lastUpdated={new Date(buildDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })} />
        
        <div className="mb-8">
          <Link
            href={`/ingredients/${ingredient}`}
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            {ingredientName} Ingredient Guide - Learn More →
          </Link>
        </div>

        <PopularIngredients excludeIngredient={ingredient} maxItems={12} />
        
        <RelatedConversions conversions={relatedConversions} />
      </div>
    </>
  );
}
