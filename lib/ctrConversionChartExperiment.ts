import { cupsToGrams, formatNumber, gramsToCups } from '@/lib/conversion';
import { normalizePathname } from '@/lib/path';
import { INGREDIENT_DENSITIES } from '@/lib/registry';

type ConversionUnit = 'grams' | 'cups';

const CTR_CHART_EXPERIMENT_PATHS = new Set<string>([
  '/q/100-grams-granulated-sugar-to-cups',
  '/cups-to-grams/soy-sauce',
  '/grams-to-cups/heavy-cream',
  '/q/200-grams-breadcrumbs-to-cups',
  '/q/200-grams-condensed-milk-to-cups',
  '/q/250-grams-coconut-shredded-to-cups',
  '/q/2-cups-cucumber-chopped-to-grams',
  '/q/100-grams-hummus-to-cups',
]);

export interface ConversionChartData {
  headers: [string, string];
  rows: [string, string][];
}

interface GetConversionChartDataParams {
  pathname: string;
  ingredient: string;
  fromUnit: ConversionUnit;
  toUnit: ConversionUnit;
  centerAmount: number;
}

export function isCtrConversionChartExperimentPath(pathname: string): boolean {
  return CTR_CHART_EXPERIMENT_PATHS.has(normalizePathname(pathname));
}

function toTitleCase(value: ConversionUnit): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function dedupeSorted(values: number[]): number[] {
  return Array.from(new Set(values)).sort((a, b) => a - b);
}

function buildNearbyGramValues(centerAmount: number): number[] {
  const step = centerAmount >= 300 ? 100 : 50;
  const candidates = [
    centerAmount - step * 2,
    centerAmount - step,
    centerAmount,
    centerAmount + step,
    centerAmount + step * 2,
  ]
    .map((value) => Math.round(value / step) * step)
    .filter((value) => value > 0);

  const values = dedupeSorted(candidates);
  while (values.length < 5) {
    const last = values[values.length - 1] ?? step;
    values.push(last + step);
  }

  return values.slice(0, 6);
}

function roundToQuarter(value: number): number {
  return Math.round(value * 4) / 4;
}

function buildNearbyCupValues(centerAmount: number): number[] {
  const step = 0.5;
  const candidates = [
    centerAmount - 1.5,
    centerAmount - 1,
    centerAmount - 0.5,
    centerAmount,
    centerAmount + 0.5,
  ]
    .map(roundToQuarter)
    .filter((value) => value > 0);

  const values = dedupeSorted(candidates);
  while (values.length < 5) {
    const last = values[values.length - 1] ?? step;
    values.push(roundToQuarter(last + step));
  }

  return values.slice(0, 6);
}

export function getCtrConversionChartData({
  pathname,
  ingredient,
  fromUnit,
  toUnit,
  centerAmount,
}: GetConversionChartDataParams): ConversionChartData | null {
  if (!isCtrConversionChartExperimentPath(pathname)) {
    return null;
  }

  if (
    Number.isNaN(centerAmount) ||
    centerAmount <= 0 ||
    (fromUnit !== 'grams' && fromUnit !== 'cups') ||
    (toUnit !== 'grams' && toUnit !== 'cups')
  ) {
    return null;
  }

  const density = INGREDIENT_DENSITIES[ingredient];
  if (!density) {
    return null;
  }

  const baseValues = fromUnit === 'grams'
    ? buildNearbyGramValues(centerAmount)
    : buildNearbyCupValues(centerAmount);

  const rows = baseValues.map((fromValue) => {
    const toValue = fromUnit === 'grams'
      ? gramsToCups(fromValue, ingredient)
      : cupsToGrams(fromValue, ingredient);

    return [formatNumber(fromValue), formatNumber(toValue)] as [string, string];
  });

  if (rows.length < 4) {
    return null;
  }

  return {
    headers: [toTitleCase(fromUnit), toTitleCase(toUnit)],
    rows,
  };
}
