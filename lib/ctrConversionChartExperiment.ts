import { cupsToGrams, formatNumber, gramsToCups } from '@/lib/conversion';
import { INGREDIENT_DENSITIES } from '@/lib/registry';

type ConversionUnit = 'grams' | 'cups';

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
  // Roll out chart UX to all supported grams<->cups conversion pages.
  // Keeping this function preserves existing call sites and behavior contracts.
  return Boolean(pathname);
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
