interface EEATSectionProps {
  lastUpdated?: string;
  showCredibility?: boolean;
}

/**
 * E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) section
 * Improves SEO signals and user trust
 */
export default function EEATSection({ 
  lastUpdated,
  showCredibility = true 
}: EEATSectionProps) {
  // Use build time or provided date, fallback to current date
  const displayDate = lastUpdated || new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <section className="mt-12 mb-8 bg-gray-50 rounded-lg p-6 border border-gray-200">
      <div className="space-y-4">
        {/* Author Section */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">About This Conversion</h3>
          <p className="text-gray-700">
            <strong className="text-gray-900">Author:</strong> CookConvert Team
          </p>
          <p className="text-gray-700 mt-1">
            <strong className="text-gray-900">Last Updated:</strong> {displayDate}
          </p>
        </div>

        {/* Credibility Paragraph */}
        {showCredibility && (
          <div className="pt-4 border-t border-gray-300">
            <h4 className="text-md font-semibold text-gray-900 mb-2">How We Source Our Data</h4>
            <p className="text-gray-700 leading-relaxed">
              Our conversion values are based on established culinary measurement standards and peer-reviewed 
              density data from authoritative sources including the USDA National Nutrient Database, professional 
              baking associations, and standardized measurement references. Density values are calculated using 
              industry-standard methods and verified against multiple authoritative sources to ensure accuracy. 
              We regularly review and update our data to reflect the most current measurement standards.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}


