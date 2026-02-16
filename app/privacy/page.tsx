import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  pageTitle: 'Privacy Policy',
  description: 'Privacy policy for CookConvert cooking measurement converter',
  pathname: '/privacy',
});

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
      
      <div className="prose max-w-none text-gray-700 space-y-6">
        <p className="text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Introduction</h2>
        <p>
          CookConvert ("we", "our", or "us") is committed to protecting your privacy. This Privacy 
          Policy explains how we collect, use, and protect your information when you use our website.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Information We Collect</h2>
        <p>
          CookConvert is designed with privacy in mind. All conversion calculations are performed 
          locally in your browser. We do not collect, store, or transmit any personal information 
          or conversion data.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How We Use Information</h2>
        <p>
          Since we do not collect personal information, we do not use it for any purpose. All 
          functionality of the website operates entirely within your browser.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Cookies</h2>
        <p>
          Currently, CookConvert does not use cookies or similar tracking technologies. If this 
          changes in the future, we will update this policy accordingly.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Third-Party Services</h2>
        <p>
          Our website may include third-party services in the future (such as analytics or advertising). 
          These services may have their own privacy policies. We will update this policy if we 
          integrate such services.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes 
          by posting the new Privacy Policy on this page and updating the "Last updated" date.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us through our 
          <a href="/contact" className="text-primary-600 hover:underline"> contact page</a>.
        </p>
      </div>
    </div>
  );
}

