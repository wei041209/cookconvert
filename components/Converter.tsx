'use client';

import { useState } from 'react';
import {
  formatNumber,
  cupsToMl,
  mlToCups,
  ozToGrams,
  gramsToOz,
  tbspToMl,
  tspToMl,
  cupsToGrams,
  gramsToCups,
  tbspToGrams,
} from '@/lib/conversion';

type ConverterKey =
  | 'cups-to-ml'
  | 'ml-to-cups'
  | 'oz-to-grams'
  | 'grams-to-oz'
  | 'tbsp-to-ml'
  | 'tsp-to-ml'
  | 'cups-to-grams'
  | 'grams-to-cups'
  | 'tbsp-to-grams';

interface ConverterProps {
  title: string;
  fromUnit: string;
  toUnit: string;
  converterKey: ConverterKey;
  ingredient?: string;
  quickValues?: number[];
  showCopy?: boolean;
}

export default function Converter({
  title,
  fromUnit,
  toUnit,
  converterKey,
  ingredient,
  quickValues = [],
  showCopy = true,
}: ConverterProps) {
  const [inputValue, setInputValue] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const compute = (value: number): number => {
    switch (converterKey) {
      // Pure math conversions
      case 'cups-to-ml':
        return cupsToMl(value);
      case 'ml-to-cups':
        return mlToCups(value);
      case 'oz-to-grams':
        return ozToGrams(value);
      case 'grams-to-oz':
        return gramsToOz(value);
      case 'tbsp-to-ml':
        return tbspToMl(value);
      case 'tsp-to-ml':
        return tspToMl(value);
      // Ingredient-based conversions
      case 'cups-to-grams':
        if (!ingredient) {
          throw new Error('Ingredient is required for cups-to-grams conversion');
        }
        return cupsToGrams(value, ingredient);
      case 'grams-to-cups':
        if (!ingredient) {
          throw new Error('Ingredient is required for grams-to-cups conversion');
        }
        return gramsToCups(value, ingredient);
      case 'tbsp-to-grams':
        if (!ingredient) {
          throw new Error('Ingredient is required for tbsp-to-grams conversion');
        }
        return tbspToGrams(value, ingredient);
      default:
        throw new Error(`Unknown converter key: ${converterKey}`);
    }
  };

  const handleConvert = (value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      try {
        setError(null);
        setResult(compute(num));
      } catch (err: any) {
        setError(err.message || 'Conversion error occurred');
        setResult(null);
      }
    } else {
      setResult(null);
      setError(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    handleConvert(value);
  };

  const handleQuickClick = (value: number) => {
    setInputValue(value.toString());
    handleConvert(value.toString());
  };

  const handleCopy = () => {
    if (result !== null) {
      navigator.clipboard.writeText(formatNumber(result));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8 min-h-[400px]">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="input" className="block text-sm font-medium text-gray-700 mb-2">
            {fromUnit}
          </label>
          <input
            id="input"
            type="number"
            min="0"
            step="0.01"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter value"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-lg"
          />
        </div>

        {quickValues.length > 0 && (
          <div>
            <p className="text-sm text-gray-600 mb-2">Quick values:</p>
            <div className="flex flex-wrap gap-2">
              {quickValues.map((val) => (
                <button
                  key={val}
                  onClick={() => handleQuickClick(val)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
                >
                  {val}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 min-h-[80px] flex items-center">
            {error}
          </div>
        )}

        {result !== null && !error && (
          <div className="mt-6 p-4 bg-primary-50 border border-primary-200 rounded-lg min-h-[100px]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{toUnit}</p>
                <p className="text-3xl font-bold text-primary-600 mt-1">
                  {formatNumber(result)}
                </p>
              </div>
              {showCopy && (
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  Copy
                </button>
              )}
            </div>
          </div>
        )}
        
        {/* Reserve space when no result to prevent CLS */}
        {result === null && !error && (
          <div className="mt-6 min-h-[100px]" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}


