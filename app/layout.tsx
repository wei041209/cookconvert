import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CookConvert - Cooking Measurement Converter',
  description: 'Convert cooking measurements instantly. Cups to grams, tablespoons to milliliters, and more. Free cooking conversion tool for bakers and chefs.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <Link href="/" className="flex items-center px-2 py-4 text-xl font-bold text-primary-600">
                  CookConvert
                </Link>
              </div>
              <div className="flex items-center space-x-4">
                <Link href="/tools" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600">
                  Tools
                </Link>
                <Link href="/ingredients" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600">
                  Ingredients
                </Link>
                <Link href="/about" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600">
                  About
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen bg-gray-50">
          {children}
        </main>
        <footer className="bg-white border-t border-gray-200 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">CookConvert</h3>
                <p className="text-sm text-gray-600">
                  Free cooking measurement converter for bakers and chefs.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Tools</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="/tools" className="hover:text-primary-600">All Tools</Link></li>
                  <li><Link href="/ingredients" className="hover:text-primary-600">Ingredients</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Legal</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="/privacy" className="hover:text-primary-600">Privacy Policy</Link></li>
                  <li><Link href="/terms" className="hover:text-primary-600">Terms of Service</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Contact</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li><Link href="/contact" className="hover:text-primary-600">Contact Us</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
              <p>&copy; {new Date().getFullYear()} CookConvert. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}


