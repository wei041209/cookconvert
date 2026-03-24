interface ConversionChartProps {
  intro: string;
  headers: [string, string];
  rows: [string, string][];
}

export default function ConversionChart({ intro, headers, rows }: ConversionChartProps) {
  return (
    <section className="bg-white rounded-lg shadow-md p-6 mb-8" aria-labelledby="conversion-chart-heading">
      <h2 id="conversion-chart-heading" className="text-2xl font-bold text-gray-900 mb-2">
        Conversion Chart
      </h2>
      <p className="text-gray-700 mb-4">{intro}</p>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                {headers[0]}
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b">
                {headers[1]}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={`${row[0]}-${row[1]}-${idx}`} className="border-b last:border-b-0">
                <td className="px-4 py-3 text-sm text-gray-700">{row[0]}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{row[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
