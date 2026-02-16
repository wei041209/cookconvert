import type { Metadata } from 'next';
import Link from 'next/link';
import Converter from '@/components/Converter';
import ConversionTable from '@/components/ConversionTable';
import FAQ from '@/components/FAQ';
import RelatedTools from '@/components/RelatedTools';
import AdSlot from '@/components/AdSlot';
import { gramsToOz, formatNumber } from '@/lib/conversion';
import { generateBreadcrumbJsonLd, generateFAQJsonLd, getRelatedTools } from '@/lib/utils';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  pageTitle: 'Grams to Ounces Converter',
  description: 'Convert grams to ounces instantly. Free cooking measurement converter for weight conversions',
  pathname: '/grams-to-oz',
});

export default function GramsToOzPage() {
  const tableData = Array.from({ length: 10 }, (_, i) => {
    const grams = (i + 1) * 50;
    return [grams.toString(), formatNumber(gramsToOz(grams))];
  });

  const faqs = [
    {
      question: 'How many ounces are in a gram?',
      answer: 'One gram equals approximately 0.035274 ounces. To convert grams to ounces, divide the grams by 28.3495.',
    },
    {
      question: 'How do I convert 100 grams to ounces?',
      answer: '100 grams equals approximately 3.527 ounces. You can use our converter above for instant results.',
    },
    {
      question: 'Is this converter accurate for all ingredients?',
      answer: 'Yes, this converter works for all ingredients when measuring by weight. Weight measurements are consistent regardless of the ingredient type.',
    },
    {
      question: 'Why do professional bakers use grams?',
      answer: 'Professional bakers prefer grams because weight measurements are more accurate and consistent than volume measurements. A gram is always a gram, regardless of how the ingredient is packed.',
    },
    {
      question: 'Can I use this for liquid ingredients?',
      answer: 'While this converter works mathematically, liquid ingredients are typically measured by volume (milliliters or fluid ounces) rather than weight. For liquids, volume conversions are more practical.',
    },
  ];

  const relatedTools = getRelatedTools('/grams-to-oz');

  const breadcrumbs = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Grams to Oz', url: '/grams-to-oz' },
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
          <span className="text-gray-900">Grams to Oz</span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-6">Grams to Ounces Converter</h1>

        <div className="prose max-w-none text-gray-700 mb-8">
          <p>
            Convert grams to ounces instantly with our free cooking measurement converter. One gram equals 
            approximately 0.035274 ounces, making this conversion essential for following recipes that use 
            different weight measurement systems.
          </p>
          <p>
            This converter is perfect for converting metric weight measurements to US ounces. Whether you're 
            working with dry ingredients, following a European recipe, or using a kitchen scale, our tool 
            provides instant, accurate results.
          </p>
          <p>
            Understanding weight conversions is crucial in baking, where precise measurements can make the 
            difference between success and failure. Many professional recipes use grams for accuracy, while 
            US recipes often use ounces.
          </p>
          <p>
            All conversions are performed instantly in your browser - no data is sent to servers, ensuring 
            your privacy. The tool is mobile-friendly and works offline, making it perfect for use in the kitchen.
          </p>
        </div>

        <Converter
          title="Grams to Ounces"
          fromUnit="Grams"
          toUnit="Ounces"
          converterKey="grams-to-oz"
          quickValues={[100, 250, 500, 750, 1000]}
        />

        <AdSlot position="below-converter" />

        <ConversionTable
          title="Grams to Ounces Conversion Table"
          headers={['Grams', 'Ounces']}
          rows={tableData}
        />

        <div className="prose max-w-none text-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Grams to Ounces Conversion</h2>
          <p>
            The conversion from grams to ounces is a standard weight conversion. One avoirdupois ounce equals 
            exactly 28.349523125 grams, so to convert grams to ounces, you divide by 28.349523125.
          </p>
          <p>
            This conversion is particularly useful when working with metric recipes or when you have a kitchen 
            scale that shows grams but need to know the equivalent in ounces.
          </p>
          <p>
            Weight measurements are preferred in professional baking because they're more accurate and consistent. 
            A gram is always a gram, regardless of how the ingredient is packed or its temperature. This makes 
            weight measurements more reliable than volume measurements.
          </p>
        </div>

        <AdSlot position="mid-content" />

        <FAQ items={faqs} />

        <RelatedTools tools={relatedTools} />
      </div>
    </>
  );
}

