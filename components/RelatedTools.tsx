import Link from 'next/link';

interface RelatedTool {
  title: string;
  href: string;
}

interface RelatedToolsProps {
  tools: RelatedTool[];
}

export default function RelatedTools({ tools }: RelatedToolsProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Related Tools</h2>
      <ul className="space-y-2">
        {tools.map((tool, idx) => (
          <li key={idx}>
            <Link
              href={tool.href}
              className="text-primary-600 hover:text-primary-700 hover:underline"
            >
              {tool.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}


