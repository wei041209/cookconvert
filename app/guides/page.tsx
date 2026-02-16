import type { Metadata } from 'next';
import Link from 'next/link';
import { buildMetadata } from '@/lib/seo';
import { normalizePathname } from '@/lib/path';

export const metadata: Metadata = buildMetadata({
  pageTitle: 'Cooking Measurement Guides - Expert Tips & Techniques',
  description: 'Comprehensive guides on cooking measurements, baking precision, flour measurement techniques, and common mistakes. Learn professional tips for accurate recipe conversions.',
  pathname: '/guides',
});

const guides = [
  {
    slug: 'grams-vs-cups-complete-guide',
    title: 'Grams vs Cups: Complete Guide',
    description: 'Learn when to use grams vs cups, why weight measurements are more accurate, and how to convert between the two systems for perfect baking results.',
    readTime: '8 min read',
  },
  {
    slug: 'why-baking-needs-precision',
    title: 'Why Baking Needs Precision',
    description: 'Discover why precision matters in baking, how small measurement errors affect your results, and professional techniques for accurate baking.',
    readTime: '10 min read',
  },
  {
    slug: 'how-to-measure-flour-correctly',
    title: 'How to Measure Flour Correctly',
    description: 'Master the art of measuring flour with professional techniques. Learn spoon-and-level method, sifting, and why weight measurements are superior.',
    readTime: '7 min read',
  },
  {
    slug: 'common-measurement-mistakes-in-baking',
    title: 'Common Measurement Mistakes in Baking',
    description: 'Avoid the most common measurement mistakes that ruin baked goods. Learn from professional bakers and improve your baking success rate.',
    readTime: '9 min read',
  },
  {
    slug: 'kitchen-conversion-chart-guide',
    title: 'Kitchen Conversion Chart Guide',
    description: 'Complete reference guide for kitchen conversions. Convert between cups, grams, ounces, tablespoons, and milliliters with confidence.',
    readTime: '12 min read',
  },
];

export default function GuidesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-4 text-sm text-gray-600">
        <Link href="/" className="hover:text-primary-600">Home</Link>
        {' / '}
        <span className="text-gray-900">Guides</span>
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-6">Cooking Measurement Guides</h1>
      
      <p className="text-xl text-gray-600 mb-8 max-w-3xl">
        Master the art of accurate cooking measurements with our comprehensive guides. Learn professional techniques, 
        avoid common mistakes, and understand the science behind precise measurements for perfect recipes every time.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        {guides.map((guide) => {
          const guidePath = normalizePathname(`/guides/${guide.slug}`);
          return (
            <Link
              key={guide.slug}
              href={guidePath}
              className="block bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-gray-200 hover:border-primary-500"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{guide.title}</h2>
              <p className="text-gray-700 mb-4">{guide.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{guide.readTime}</span>
                <span className="text-primary-600 font-medium">Read Guide →</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-16 bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Accurate Measurements Matter</h2>
        <p className="text-gray-700 mb-4">
          Whether you're a beginner cook or an experienced baker, understanding measurement techniques is crucial 
          for recipe success. Our guides cover everything from basic conversions to advanced professional techniques.
        </p>
        <p className="text-gray-700 mb-4">
          Each guide is written by culinary experts and includes practical tips, common mistakes to avoid, and 
          links to our conversion tools for instant calculations. Start with any guide that matches your needs, 
          or read them all to become a measurement master.
        </p>
        <div className="mt-6">
          <Link
            href="/tools"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
          >
            Explore Conversion Tools →
          </Link>
        </div>
      </div>
    </div>
  );
}

