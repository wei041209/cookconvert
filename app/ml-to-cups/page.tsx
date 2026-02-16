import type { Metadata } from 'next';
import Link from 'next/link';
import Converter from '@/components/Converter';
import ConversionTable from '@/components/ConversionTable';
import FAQ from '@/components/FAQ';
import RelatedTools from '@/components/RelatedTools';
import AdSlot from '@/components/AdSlot';
import { mlToCups, formatNumber } from '@/lib/conversion';
import { generateBreadcrumbJsonLd, generateFAQJsonLd, getRelatedTools } from '@/lib/utils';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  pageTitle: 'Milliliters to Cups Converter',
  description: 'Convert milliliters to cups instantly. Free cooking measurement converter for volume conversions',
  pathname: '/ml-to-cups',
});

export default function MlToCupsPage() {
  const tableData = Array.from({ length: 10 }, (_, i) => {
    const ml = (i + 1) * 50;
    return [ml.toString(), formatNumber(mlToCups(ml))];
  });

  const faqs = [
    {
      question: 'How many cups are in a milliliter?',
      answer: 'One milliliter equals approximately 0.004227 cups. To convert milliliters to cups, divide the milliliters by 236.588.',
    },
    {
      question: 'How do I convert 250 ml to cups?',
      answer: '250 milliliters equals approximately 1.057 cups. You can use our converter above for instant results.',
    },
    {
      question: 'Is this converter accurate for all liquids?',
      answer: 'Yes, this converter works for all liquids. Volume conversions are consistent regardless of the liquid type, as long as you\'re measuring at the same temperature.',
    },
    {
      question: 'Can I use this for dry ingredients?',
      answer: 'While this converter works mathematically for dry ingredients, weight-based conversions (grams to cups) are more accurate for dry ingredients due to varying densities.',
    },
    {
      question: 'What is the difference between US and metric cups?',
      answer: 'A US cup is 236.588 ml, while a metric cup is 250 ml. Our converter uses the US standard. Always check which cup measurement your recipe uses.',
    },
  ];

  const relatedTools = getRelatedTools('/ml-to-cups');

  const breadcrumbs = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'ML to Cups', url: '/ml-to-cups' },
  ]);

  const faqJsonLd = generateFAQJsonLd(faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-4 text-sm text-gray-600">
          <Link href="/" className="hover:text-primary-600">Home</Link>
          {' / '}
          <Link href="/tools" className="hover:text-primary-600">Tools</Link>
          {' / '}
          <span className="text-gray-900">ML to Cups</span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-6">Milliliters to Cups Converter</h1>

        <div className="prose max-w-none text-gray-700 mb-8">
          <p>
            Convert milliliters to cups instantly with our free cooking measurement converter. One milliliter 
            equals approximately 0.004227 cups, making this conversion essential for following recipes that 
            use metric measurements.
          </p>
          <p>
            This converter is perfect for converting metric measurements to US cup measurements. Whether 
            you're working with liquids or need to convert a recipe, our tool provides instant, accurate results.
          </p>
          <p>
            Understanding volume conversions is crucial when working with international recipes. Many European 
            and metric-based recipes use milliliters, while US recipes often use cups. Our converter helps 
            you seamlessly switch between these measurement systems.
          </p>
          <p>
            All conversions are performed instantly in your browser - no data is sent to servers, ensuring 
            your privacy. The tool is mobile-friendly and works offline, making it perfect for use in the kitchen.
          </p>
        </div>

        <Converter
          title="Milliliters to Cups"
          fromUnit="Milliliters"
          toUnit="Cups"
          converterKey="ml-to-cups"
          quickValues={[100, 250, 500, 750, 1000]}
        />

        <AdSlot position="below-converter" />

        <ConversionTable
          title="Milliliters to Cups Conversion Table"
          headers={['Milliliters', 'Cups']}
          rows={tableData}
        />

        <div className="prose max-w-none text-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Milliliters to Cups Conversion</h2>
          <p>
            The conversion from milliliters to cups is a standard volume conversion. One US cup equals 
            236.588 milliliters, so to convert milliliters to cups, you divide by 236.588.
          </p>
          <p>
            This conversion is particularly useful when working with metric recipes or when you have a 
            measuring cup that shows milliliters but need to know the equivalent in cups.
          </p>
          <p>
            For accurate conversions, always use the same measurement system throughout your recipe. If a 
            recipe specifies milliliters, use milliliters. If it specifies cups, use cups. Our converter helps 
            you switch between these systems seamlessly.
          </p>
        </div>

        <AdSlot position="mid-content" />

        <FAQ items={faqs} />

        <RelatedTools tools={relatedTools} />
      </div>
    </>
  );
}

