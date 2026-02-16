interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
}

export default function FAQ({ items }: FAQProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
      <div className="space-y-6">
        {items.map((item, idx) => (
          <div key={idx}>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {item.question}
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {item.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}


