import type { Metadata } from 'next';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  pageTitle: 'About CookConvert',
  description: 'Learn about CookConvert, a free cooking measurement converter tool for bakers and chefs',
  pathname: '/about',
});

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">About CookConvert</h1>
      
      <div className="prose max-w-none text-gray-700 space-y-6">
        <p>
          CookConvert is a free, easy-to-use cooking measurement converter designed to help bakers, 
          chefs, and home cooks convert between different measurement units accurately and instantly.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Our Mission</h2>
        <p>
          We believe that cooking should be accessible to everyone, regardless of where you are or 
          what measurement system you're using. Our goal is to provide accurate, instant conversions 
          that help you follow recipes from around the world without confusion.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Features</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Ingredient-specific conversions for over 20 common ingredients</li>
          <li>Pure math converters for standard measurement units</li>
          <li>Instant calculations - no page reloads required</li>
          <li>Mobile-friendly design for use in the kitchen</li>
          <li>Privacy-focused - all calculations happen in your browser</li>
          <li>Free to use - no registration required</li>
        </ul>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Accuracy</h2>
        <p>
          Our conversion values are based on standard culinary measurements and ingredient densities. 
          We use precise conversion factors to ensure accuracy, though slight variations may occur 
          based on factors like ingredient packing, temperature, and brand.
        </p>
        
        <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact</h2>
        <p>
          Have questions or suggestions? Please visit our <a href="/contact" className="text-primary-600 hover:underline">contact page</a>.
        </p>
      </div>
    </div>
  );
}

