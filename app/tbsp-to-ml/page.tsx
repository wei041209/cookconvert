import type { Metadata } from 'next';
import Link from 'next/link';
import Converter from '@/components/Converter';
import ConversionTable from '@/components/ConversionTable';
import FAQ from '@/components/FAQ';
import RelatedTools from '@/components/RelatedTools';
import AdSlot from '@/components/AdSlot';
import { tbspToMl, formatNumber } from '@/lib/conversion';
import { generateBreadcrumbJsonLd, generateFAQJsonLd, getRelatedTools } from '@/lib/utils';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  pageTitle: 'Tablespoons to Milliliters Converter',
  description: 'Convert tablespoons to milliliters instantly. Free cooking measurement converter for volume conversions',
  pathname: '/tbsp-to-ml',
});

export default function TbspToMlPage() {
  const tableData = Array.from({ length: 10 }, (_, i) => {
    const tbsp = i + 1;
    return [tbsp.toString(), formatNumber(tbspToMl(tbsp))];
  });

  const faqs = [
    {
      question: 'How many milliliters are in a tablespoon?',
      answer: 'One US tablespoon equals 14.7868 milliliters. This is the standard conversion used in cooking and baking.',
    },
    {
      question: 'Is a tablespoon the same worldwide?',
      answer: 'No, tablespoon measurements vary by country. A US tablespoon is 14.7868 ml, while a UK tablespoon is 17.7582 ml, and an Australian tablespoon is 20 ml. Our converter uses the US standard.',
    },
    {
      question: 'How do I convert tablespoons to milliliters?',
      answer: 'To convert tablespoons to milliliters, multiply the number of tablespoons by 14.7868. For example, 3 tablespoons equals 44.36 milliliters.',
    },
    {
      question: 'Can I use this for liquid and dry ingredients?',
      answer: 'Yes, this converter works for both liquid and dry ingredients. However, for dry ingredients, weight conversions may be more accurate for recipe purposes.',
    },
    {
      question: 'How many tablespoons are in a cup?',
      answer: 'There are 16 tablespoons in one US cup. This is a useful conversion to remember when scaling recipes.',
    },
  ];

  const relatedTools = getRelatedTools('/tbsp-to-ml');

  const breadcrumbs = generateBreadcrumbJsonLd([
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Tbsp to ML', url: '/tbsp-to-ml' },
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
          <span className="text-gray-900">Tbsp to ML</span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-6">Tablespoons to Milliliters Converter</h1>

        <div className="prose max-w-none text-gray-700 mb-8">
          <p>
            Convert tablespoons to milliliters instantly with our free cooking measurement converter. One US 
            tablespoon equals 14.7868 milliliters, making this conversion essential for following recipes 
            that use different volume measurement systems.
          </p>
          <p>
            This converter is perfect for converting US tablespoon measurements to metric milliliters. Whether 
            you're working with liquids, spices, or any other ingredient, our tool provides instant, accurate results.
          </p>
          <p>
            Understanding volume conversions is crucial when working with international recipes. Many European 
            recipes use milliliters, while US recipes often use tablespoons. Our converter helps you seamlessly 
            switch between these measurement systems.
          </p>
          <p>
            All conversions are performed instantly in your browser - no data is sent to servers, ensuring 
            your privacy. The tool is mobile-friendly and works offline, making it perfect for use in the kitchen.
          </p>
        </div>

        <Converter
          title="Tablespoons to Milliliters"
          fromUnit="Tablespoons"
          toUnit="Milliliters"
          converterKey="tbsp-to-ml"
          quickValues={[1, 2, 4, 8, 16]}
        />

        <AdSlot position="below-converter" />

        <ConversionTable
          title="Tablespoons to Milliliters Conversion Table"
          headers={['Tablespoons', 'Milliliters']}
          rows={tableData}
        />

        <div className="prose max-w-none text-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Tablespoons to Milliliters Conversion</h2>
          <p>
            The conversion from tablespoons to milliliters is a standard volume conversion. One US tablespoon 
            equals exactly 14.78676478125 milliliters.
          </p>
          <p>
            It's important to note that tablespoon measurements can vary by country. The US tablespoon (14.7868 ml) 
            differs from the UK tablespoon (17.7582 ml) and the Australian tablespoon (20 ml). Our converter uses 
            the US standard, which is the most commonly used in recipes.
          </p>
          <p>
            For accurate conversions, always use the same measurement system throughout your recipe. If a recipe 
            specifies tablespoons, use tablespoons. If it specifies milliliters, use milliliters. Our converter 
            helps you switch between these systems seamlessly.
          </p>
        </div>

        <AdSlot position="mid-content" />

        <FAQ items={faqs} />

        <RelatedTools tools={relatedTools} />
      </div>
    </>
  );
}

