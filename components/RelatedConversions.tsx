import Link from 'next/link';

interface RelatedConversion {
  title: string;
  href: string;
}

interface RelatedConversionsProps {
  conversions: RelatedConversion[];
}

/**
 * Related Conversions component for SEO and user engagement
 * Displays 6-8 related conversion links in a responsive grid layout
 */
export default function RelatedConversions({ conversions }: RelatedConversionsProps) {
  if (!conversions || conversions.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 mb-8" aria-label="Related Conversions">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Conversions</h2>
        <nav aria-label="Related conversion links">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" style={{ minHeight: '200px' }}>
            {conversions.map((conversion, idx) => (
              <li key={idx}>
                <Link
                  href={conversion.href}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all duration-200 group"
                >
                  <span className="text-primary-600 font-medium group-hover:text-primary-700 group-hover:underline">
                    {conversion.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}

