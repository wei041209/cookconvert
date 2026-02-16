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
import { tspToMl, formatNumber } from '@/lib/conversion';
import { generateBreadcrumbJsonLd, generateFAQJsonLd, generateArticleJsonLd, getRelatedConversions } from '@/lib/utils';
import { buildMetadata } from '@/lib/seo';
import { normalizePathname } from '@/lib/path';

export const metadata: Metadata = buildMetadata({
  pageTitle: 'Teaspoons to Milliliters Converter',
  description: 'Convert teaspoons to milliliters instantly. Free cooking measurement converter for volume conversions',
  pathname: '/tsp-to-ml',
});

export default function TspToMlPage() {
  const tableData = Array.from({ length: 10 }, (_, i) => {
    const tsp = i + 1;
    return [tsp.toString(), formatNumber(tspToMl(tsp))];
  });

  const faqs = [
    {
      question: 'How many milliliters are in a teaspoon?',
      answer: 'One US teaspoon equals 4.9289 milliliters. This is the standard conversion used in cooking and baking.',
    },
    {
      question: 'Is a teaspoon the same worldwide?',
      answer: 'No, teaspoon measurements vary by country. A US teaspoon is 4.9289 ml, while a UK teaspoon is 5.9194 ml, and an Australian teaspoon is 5 ml. Our converter uses the US standard.',
    },
    {
      question: 'How do I convert teaspoons to milliliters?',
      answer: 'To convert teaspoons to milliliters, multiply the number of teaspoons by 4.9289. For example, 3 teaspoons equals 14.79 milliliters.',
    },
    {
      question: 'How many teaspoons are in a tablespoon?',
      answer: 'There are 3 teaspoons in one US tablespoon. This is a useful conversion to remember when scaling recipes.',
    },
    {
      question: 'Can I use this for liquid and dry ingredients?',
      answer: 'Yes, this converter works for both liquid and dry ingredients. However, for dry ingredients, weight conversions may be more accurate for recipe purposes, especially for small amounts.',
    },
  ];

  const normalizedPath = normalizePathname('/tsp-to-ml');
  const relatedConversions = getRelatedConversions(normalizedPath);

  const breadcrumbs = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Tsp to ML', url: '/tsp-to-ml' },
  ]);

  const faqJsonLd = generateFAQJsonLd(faqs);
  
  // Article schema for E-E-A-T
  const buildDate = process.env.NEXT_PUBLIC_BUILD_TIME 
    ? new Date(process.env.NEXT_PUBLIC_BUILD_TIME).toISOString()
    : new Date().toISOString();
  const articleJsonLd = generateArticleJsonLd({
    title: 'Teaspoons to Milliliters Converter',
    description: 'Convert teaspoons to milliliters instantly. Free cooking measurement converter for volume conversions',
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
          <span className="text-gray-900">Tsp to ML</span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-6">Teaspoons to Milliliters Converter</h1>

        <div className="prose max-w-none text-gray-700 mb-8">
          <p>
            Convert teaspoons to milliliters instantly with our free cooking measurement converter. One US 
            teaspoon equals 4.9289 milliliters, making this conversion essential for following recipes that 
            use different volume measurement systems.
          </p>
          <p>
            This converter is perfect for converting US teaspoon measurements to metric milliliters. Whether 
            you're working with liquids, spices, extracts, or any other ingredient, our tool provides instant, 
            accurate results.
          </p>
          <p>
            Understanding volume conversions is crucial when working with international recipes. Many European 
            recipes use milliliters, while US recipes often use teaspoons. Our converter helps you seamlessly 
            switch between these measurement systems.
          </p>
          <p>
            All conversions are performed instantly in your browser - no data is sent to servers, ensuring 
            your privacy. The tool is mobile-friendly and works offline, making it perfect for use in the kitchen.
          </p>
        </div>

        <Converter
          title="Teaspoons to Milliliters"
          fromUnit="Teaspoons"
          toUnit="Milliliters"
          converterKey="tsp-to-ml"
          quickValues={[1, 2, 3, 4, 5]}
        />

        <AdSlot position="below-converter" />

        <ConversionTable
          title="Teaspoons to Milliliters Conversion Table"
          headers={['Teaspoons', 'Milliliters']}
          rows={tableData}
        />

        <div className="prose max-w-none text-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Teaspoons to Milliliters Conversion</h2>
          <p>
            The conversion from teaspoons to milliliters is a standard volume conversion. One US teaspoon 
            equals exactly 4.92892159375 milliliters.
          </p>
          <p>
            It's important to note that teaspoon measurements can vary by country. The US teaspoon (4.9289 ml) 
            differs from the UK teaspoon (5.9194 ml) and the Australian teaspoon (5 ml). Our converter uses 
            the US standard, which is the most commonly used in recipes.
          </p>
          <p>
            For accurate conversions, always use the same measurement system throughout your recipe. If a recipe 
            specifies teaspoons, use teaspoons. If it specifies milliliters, use milliliters. Our converter helps 
            you switch between these systems seamlessly.
          </p>
          <p>
            Teaspoons are commonly used for small amounts of ingredients like spices, extracts, and flavorings. 
            Converting to milliliters is especially useful when working with metric recipes or when using a 
            measuring tool that shows milliliters.
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

