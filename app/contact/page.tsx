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
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Contact Us</h1>
      
      <div className="prose max-w-none text-gray-700 space-y-6">
        <p>
          We'd love to hear from you! Whether you have questions, suggestions, or feedback about 
          CookConvert, please reach out to us.
        </p>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
          <p className="mb-4">
            For general inquiries, suggestions, or to report issues, please use the contact form 
            below or email us directly.
          </p>
          
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              ></textarea>
            </div>
            
            <button
              type="submit"
              className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Send Message
            </button>
          </form>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Note</h2>
          <p className="text-sm text-gray-600">
            This is a static contact form. In a production environment, you would integrate this 
            with an email service or contact form handler.
          </p>
        </div>
      </div>
    </div>
  );
}

