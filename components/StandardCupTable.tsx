/**
 * Static table showing different cup measurement standards
 * Used to build trust and provide reference information
 */
export default function StandardCupTable() {
  const standards = [
    { standard: 'US cup', milliliters: '236.588 ml' },
    { standard: 'Metric cup', milliliters: '250 ml' },
    { standard: 'UK cup', milliliters: '284.131 ml' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Cup Measurement Standards</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Standard
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Milliliters
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {standards.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.standard}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {item.milliliters}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-sm text-gray-600">
        Our converter uses the US cup standard (236.588 ml), which is the most commonly used in recipes.
      </p>
    </div>
  );
}

