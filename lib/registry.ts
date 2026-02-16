// Whitelist arrays - ALL routes must be generated from these

export const INGREDIENTS = [
  'flour',
  'sugar',
  'brown-sugar',
  'butter',
  'milk',
  'water',
  'honey',
  'olive-oil',
  'rice',
  'salt',
  'baking-powder',
  'cocoa-powder',
  'oats',
  'yogurt',
  'cream',
  'chopped-onion',
  'shredded-cheese',
  'breadcrumbs',
  'peanut-butter',
  'jam',
] as const;

export const INGREDIENT_CONVERTERS = [
  'cups-to-grams',
  'grams-to-cups',
  'tbsp-to-grams',
] as const;

export const PURE_PAGES = [
  'cups-to-ml',
  'ml-to-cups',
  'oz-to-grams',
  'grams-to-oz',
  'tbsp-to-ml',
  'tsp-to-ml',
] as const;

// Ingredient densities (grams per cup)
export const INGREDIENT_DENSITIES: Record<string, number> = {
  'flour': 120,
  'sugar': 200,
  'brown-sugar': 220,
  'butter': 227,
  'milk': 240,
  'water': 236,
  'honey': 340,
  'olive-oil': 215,
  'rice': 185,
  'salt': 288,
  'baking-powder': 192,
  'cocoa-powder': 100,
  'oats': 90,
  'yogurt': 245,
  'cream': 240,
  'chopped-onion': 160,
  'shredded-cheese': 110,
  'breadcrumbs': 120,
  'peanut-butter': 270,
  'jam': 320,
};

// Ingredient display names
export const INGREDIENT_NAMES: Record<string, string> = {
  'flour': 'Flour',
  'sugar': 'Sugar',
  'brown-sugar': 'Brown Sugar',
  'butter': 'Butter',
  'milk': 'Milk',
  'water': 'Water',
  'honey': 'Honey',
  'olive-oil': 'Olive Oil',
  'rice': 'Rice',
  'salt': 'Salt',
  'baking-powder': 'Baking Powder',
  'cocoa-powder': 'Cocoa Powder',
  'oats': 'Oats',
  'yogurt': 'Yogurt',
  'cream': 'Cream',
  'chopped-onion': 'Chopped Onion',
  'shredded-cheese': 'Shredded Cheese',
  'breadcrumbs': 'Breadcrumbs',
  'peanut-butter': 'Peanut Butter',
  'jam': 'Jam',
};

export type Ingredient = typeof INGREDIENTS[number];
export type IngredientConverter = typeof INGREDIENT_CONVERTERS[number];
export type PurePage = typeof PURE_PAGES[number];


