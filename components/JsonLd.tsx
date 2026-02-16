interface JsonLdProps {
  data: unknown;
}

/**
 * Reusable component for rendering JSON-LD structured data
 */
export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

