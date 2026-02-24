import { INGREDIENT_DENSITIES } from './registry';

// Ingredient-based conversions
export function cupsToGrams(cups: number, ingredient: string): number {
  const density = INGREDIENT_DENSITIES[ingredient] || 0;
  return cups * density;
}

export function gramsToCups(grams: number, ingredient: string): number {
  const density = INGREDIENT_DENSITIES[ingredient] || 0;
  return density > 0 ? grams / density : 0;
}

export function tbspToGrams(tbsp: number, ingredient: string): number {
  const density = INGREDIENT_DENSITIES[ingredient] || 0;
  return (tbsp / 16) * density;
}

// Pure math conversions
export function cupsToMl(cups: number): number {
  return cups * 236.5882365;
}

export function mlToCups(ml: number): number {
  return ml / 236.5882365;
}

export function ozToGrams(oz: number): number {
  return oz * 28.349523125;
}

export function gramsToOz(grams: number): number {
  return grams / 28.349523125;
}

export function tbspToMl(tbsp: number): number {
  return tbsp * 14.78676478125;
}

export function tspToMl(tsp: number): number {
  return tsp * 4.92892159375;
}

// Format number for display
export function formatNumber(num: number, decimals: number = 2): string {
  return num.toFixed(decimals).replace(/\.?0+$/, '');
}



