import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import ConversionTable from '@/components/ConversionTable';
import EEATSection from '@/components/EEATSection';
import AdSlot from '@/components/AdSlot';
import JsonLd from '@/components/JsonLd';

// Lazy load below-the-fold components for better performance
const Converter = dynamic(() => import('@/components/Converter'), {
  ssr: true,
});

const FAQ = dynamic(() => import('@/components/FAQ'), {
  ssr: true,
});

const RelatedConversions = dynamic(() => import('@/components/RelatedConversions'), {
  ssr: true,
});
import { ozToGrams, formatNumber } from '@/lib/conversion';
import { generateBreadcrumbJsonLd, generateFAQJsonLd, generateArticleJsonLd, getRelatedConversions } from '@/lib/utils';
import { normalizePathname } from '@/lib/path';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  pageTitle: 'Ounces to Grams Converter',
  description: 'Convert ounces to grams instantly. Free cooking measurement converter for weight conversions',
  pathname: '/oz-to-grams',
});

export default function OzToGramsPage() {
  const tableData = Array.from({ length: 10 }, (_, i) => {
    const oz = (i + 1) * 2;
    return [oz.toString(), formatNumber(ozToGrams(oz))];
  });

  const faqs = [
    {
      question: 'How many grams are in an ounce?',
      answer: 'One ounce equals 28.3495 grams. This is the standard conversion used for weight measurements in cooking.',
    },
    {
      question: 'Is this for fluid ounces or weight ounces?',
      answer: 'This converter is for weight ounces (avoirdupois ounces), not fluid ounces. Fluid ounces measure volume, while weight ounces measure mass.',
    },
    {
      question: 'How do I convert ounces to grams?',
      answer: 'To convert ounces to grams, multiply the number of ounces by 28.3495. For example, 4 ounces equals 113.398 grams.',
    },
    {
      question: 'Can I use this for all ingredients?',
      answer: 'Yes, this converter works for all ingredients when measuring by weight. Weight measurements are more accurate than volume measurements for dry ingredients.',
    },
    {
      question: 'Why use weight measurements instead of volume?',
      answer: 'Weight measurements are more accurate and consistent, especially for dry ingredients. A cup of flour can vary in weight based on how it\'s packed, but 120 grams of flour is always 120 grams.',
    },
  ];

  const normalizedPath = normalizePathname('/oz-to-grams');
  const relatedConversions = getRelatedConversions(normalizedPath);

  const breadcrumbs = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Oz to Grams', url: '/oz-to-grams' },
  ]);

  const faqJsonLd = generateFAQJsonLd(faqs);
  
  // Article schema for E-E-A-T
  const buildDate = process.env.NEXT_PUBLIC_BUILD_TIME 
    ? new Date(process.env.NEXT_PUBLIC_BUILD_TIME).toISOString()
    : new Date().toISOString();
  const articleJsonLd = generateArticleJsonLd({
    title: 'Ounces to Grams Converter',
    description: 'Convert ounces to grams instantly. Free cooking measurement converter for weight conversions',
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
          <span className="text-gray-900">Oz to Grams</span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-6">Ounces to Grams Converter</h1>

        <div className="prose max-w-none text-gray-700 mb-8">
          <p>
            Convert ounces to grams instantly with our free cooking measurement converter. One ounce equals 
            28.3495 grams, making this conversion essential for following recipes that use different weight 
            measurement systems.
          </p>
          <p>
            This converter is perfect for converting US weight measurements to metric. Whether you're working 
            with dry ingredients, liquids, or any other ingredient, our tool provides instant, accurate results.
          </p>
          <p>
            Understanding weight conversions is crucial in baking, where precise measurements can make the 
            difference between success and failure. Many professional recipes use weight measurements for 
            accuracy and consistency.
          </p>
          <p>
            All conversions are performed instantly in your browser - no data is sent to servers, ensuring 
            your privacy. The tool is mobile-friendly and works offline, making it perfect for use in the kitchen.
          </p>
        </div>

        <Converter
          title="Ounces to Grams"
          fromUnit="Ounces"
          toUnit="Grams"
          converterKey="oz-to-grams"
          quickValues={[1, 2, 4, 8, 16]}
        />

        <AdSlot position="below-converter" />

        <ConversionTable
          title="Ounces to Grams Conversion Table"
          headers={['Ounces', 'Grams']}
          rows={tableData}
        />

        <div className="prose max-w-none text-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Ounces to Grams Conversion</h2>
          <p>
            The conversion from ounces to grams is a standard weight conversion. One avoirdupois ounce (the 
            standard ounce used in the US) equals exactly 28.349523125 grams.
          </p>
          <p>
            It's important to distinguish between weight ounces and fluid ounces. Weight ounces measure mass, 
            while fluid ounces measure volume. This converter is for weight ounces only.
          </p>
          <p>
            Weight measurements are preferred in professional baking because they're more accurate and consistent. 
            A kitchen scale is one of the most important tools for accurate baking, and this converter helps 
            you use it effectively with recipes that specify ounces.
          </p>
        </div>

        <AdSlot position="mid-content" />

        <FAQ items={faqs} />

        <EEATSection lastUpdated={new Date(buildDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })} />

        <RelatedConversions conversions={relatedConversions} />
      </div>
    </>
  );
}

