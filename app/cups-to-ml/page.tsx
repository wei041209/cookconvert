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
import StandardCupTable from '@/components/StandardCupTable';
import { cupsToMl, formatNumber } from '@/lib/conversion';
import { generateBreadcrumbJsonLd, generateFAQJsonLd, generateArticleJsonLd, getRelatedConversions } from '@/lib/utils';
import { buildMetadata } from '@/lib/seo';
import { normalizePathname } from '@/lib/path';

export const metadata: Metadata = buildMetadata({
  pageTitle: 'Cups to Milliliters Converter',
  description: 'Convert cups to milliliters instantly. Free cooking measurement converter for volume conversions',
  pathname: '/cups-to-ml',
});

export default function CupsToMlPage() {
  const tableData = Array.from({ length: 10 }, (_, i) => {
    const cups = (i + 1) * 0.5;
    return [formatNumber(cups), formatNumber(cupsToMl(cups))];
  });

  const faqs = [
    {
      question: 'How many milliliters are in a cup?',
      answer: 'One US cup equals 236.588 milliliters. This is the standard conversion used in cooking and baking.',
    },
    {
      question: 'Is a cup measurement the same worldwide?',
      answer: 'No, cup measurements vary by country. A US cup is 236.588 ml, while a metric cup is 250 ml, and a UK cup is 284.131 ml. Our converter uses the US standard.',
    },
    {
      question: 'How do I convert cups to milliliters?',
      answer: 'To convert cups to milliliters, multiply the number of cups by 236.588. For example, 2 cups equals 473.176 milliliters.',
    },
    {
      question: 'Can I use this for liquid and dry ingredients?',
      answer: 'Yes, this converter works for both liquid and dry ingredients. However, for dry ingredients, weight conversions (cups to grams) may be more accurate for recipe purposes.',
    },
    {
      question: 'Why is precise measurement important in cooking?',
      answer: 'Precise measurements are crucial in baking, where the ratio of ingredients affects texture and rise. In cooking, precise measurements help ensure consistent results.',
    },
  ];

  const normalizedPath = normalizePathname('/cups-to-ml');
  const relatedConversions = getRelatedConversions(normalizedPath);

  const breadcrumbs = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Cups to ML', url: '/cups-to-ml' },
  ]);

  const faqJsonLd = generateFAQJsonLd(faqs);
  
  // Article schema for E-E-A-T
  const buildDate = process.env.NEXT_PUBLIC_BUILD_TIME 
    ? new Date(process.env.NEXT_PUBLIC_BUILD_TIME).toISOString()
    : new Date().toISOString();
  const articleJsonLd = generateArticleJsonLd({
    title: 'Cups to Milliliters Converter',
    description: 'Convert cups to milliliters instantly. Free cooking measurement converter for volume conversions',
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
          <span className="text-gray-900">Cups to ML</span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-6">Cups to Milliliters Converter</h1>

        <div className="prose max-w-none text-gray-700 mb-8">
          <p>
            Convert cups to milliliters instantly with our free cooking measurement converter. One US cup 
            equals 236.588 milliliters, making this conversion essential for following recipes from different 
            countries or using metric measurements.
          </p>
          <p>
            This converter is perfect for both liquid and dry ingredients. Whether you're measuring water, 
            milk, flour, or any other ingredient, our tool provides instant, accurate conversions.
          </p>
          <p>
            Understanding volume conversions is crucial in cooking and baking. Many recipes use cups, while 
            others use milliliters. Our converter helps you seamlessly switch between these measurement systems.
          </p>
          <p>
            All conversions are performed instantly in your browser - no data is sent to servers, ensuring 
            your privacy. The tool is mobile-friendly and works offline, making it perfect for use in the kitchen.
          </p>
        </div>

        <Converter
          title="Cups to Milliliters"
          fromUnit="Cups"
          toUnit="Milliliters"
          converterKey="cups-to-ml"
          quickValues={[0.25, 0.5, 1, 2, 3, 4]}
        />

        <AdSlot position="below-converter" />

        <ConversionTable
          title="Cups to Milliliters Conversion Table"
          headers={['Cups', 'Milliliters']}
          rows={tableData}
        />

        <div className="prose max-w-none text-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Cups to Milliliters Conversion</h2>
          <p>
            The conversion from cups to milliliters is a standard volume conversion used in cooking. One US 
            cup is defined as exactly 236.588 milliliters. This conversion factor is based on the US customary 
            system of measurement.
          </p>
          <p>
            It's important to note that cup measurements can vary by country. The US cup (236.588 ml) differs 
            from the metric cup (250 ml) and the UK cup (284.131 ml). Our converter uses the US standard, 
            which is the most commonly used in recipes.
          </p>
          
          <StandardCupTable />
          
          <p>
            For accurate conversions, always use the same measurement system throughout your recipe. If a 
            recipe specifies cups, use cups. If it specifies milliliters, use milliliters. Our converter helps 
            you switch between these systems seamlessly.
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

