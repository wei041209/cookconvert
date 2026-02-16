import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  pageTitle: 'Contact Us',
  description: 'Contact CookConvert for questions, suggestions, or support',
  pathname: '/contact',
});

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
        
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          If you have any questions, suggestions, or business inquiries, feel free to email us directly.
        </p>
        
        <div className="mt-8">
          <a
            href="mailto:jiangweicheng1209@gmail.com"
            className="inline-block px-8 py-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-lg"
          >
            jiangweicheng1209@gmail.com
          </a>
        </div>
      </div>
    </div>
  );
}

