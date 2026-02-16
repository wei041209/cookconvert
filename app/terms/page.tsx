import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  pageTitle: 'Terms of Service',
  description: 'Terms of service for CookConvert cooking measurement converter',
  pathname: '/terms',
});

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
      
      <div className="prose max-w-none text-gray-700 space-y-6">
        <p className="text-sm text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Agreement to Terms</h2>
        <p>
          By accessing and using CookConvert, you accept and agree to be bound by the terms and 
          provision of this agreement.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Use License</h2>
        <p>
          Permission is granted to temporarily use CookConvert for personal, non-commercial 
          transitory viewing only. This is the grant of a license, not a transfer of title, and 
          under this license you may not:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Modify or copy the materials</li>
          <li>Use the materials for any commercial purpose</li>
          <li>Attempt to reverse engineer any software contained on the website</li>
          <li>Remove any copyright or other proprietary notations from the materials</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Disclaimer</h2>
        <p>
          The materials on CookConvert are provided on an 'as is' basis. CookConvert makes no 
          warranties, expressed or implied, and hereby disclaims and negates all other warranties 
          including, without limitation, implied warranties or conditions of merchantability, fitness 
          for a particular purpose, or non-infringement of intellectual property or other violation 
          of rights.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Accuracy of Materials</h2>
        <p>
          The materials appearing on CookConvert could include technical, typographical, or 
          photographic errors. CookConvert does not warrant that any of the materials on its website 
          are accurate, complete, or current. CookConvert may make changes to the materials contained 
          on its website at any time without notice.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Limitations</h2>
        <p>
          In no event shall CookConvert or its suppliers be liable for any damages (including, without 
          limitation, damages for loss of data or profit, or due to business interruption) arising 
          out of the use or inability to use the materials on CookConvert, even if CookConvert or a 
          CookConvert authorized representative has been notified orally or in writing of the possibility 
          of such damage.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Revisions</h2>
        <p>
          CookConvert may revise these terms of service for its website at any time without notice. 
          By using this website you are agreeing to be bound by the then current version of these 
          terms of service.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact Us</h2>
        <p>
          If you have questions about these Terms of Service, please contact us through our 
          <a href="/contact" className="text-primary-600 hover:underline"> contact page</a>.
        </p>
      </div>
    </div>
  );
}

