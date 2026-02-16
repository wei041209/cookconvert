'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { buildSearchIndex, searchIndex, type SearchResult } from '@/lib/search';

/**
 * Site-wide search component with instant results
 * Keyboard accessible and optimized for performance
 */
export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Build search index once (memoized) - only on client
  const index = useMemo(() => {
    if (typeof window !== 'undefined') {
      return buildSearchIndex();
    }
    return [];
  }, []);

  // Handle search input
  useEffect(() => {
    if (query.trim().length > 0) {
      const searchResults = searchIndex(query, index);
      setResults(searchResults);
      setIsOpen(true);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query, index]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => 
          prev < results.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          window.location.href = results[selectedIndex].href;
        } else if (results.length > 0) {
          window.location.href = results[0].href;
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setQuery('');
        searchInputRef.current?.blur();
        break;
    }
  };

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsRef.current) {
      const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <input
          ref={searchInputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder="Search ingredients, converters..."
          className="w-full px-4 py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
          aria-label="Search"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="search-results"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div
          ref={resultsRef}
          id="search-results"
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto"
          role="listbox"
        >
          {results.map((result, index) => (
            <Link
              key={`${result.href}-${index}`}
              href={result.href}
              className={`block px-4 py-3 hover:bg-primary-50 transition-colors ${
                index === selectedIndex ? 'bg-primary-50' : ''
              } ${index === 0 ? 'rounded-t-lg' : ''} ${
                index === results.length - 1 ? 'rounded-b-lg' : ''
              }`}
              role="option"
              aria-selected={index === selectedIndex}
              onClick={() => {
                setIsOpen(false);
                setQuery('');
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{result.title}</div>
                  {result.description && (
                    <div className="text-sm text-gray-600 mt-1">
                      {result.description}
                    </div>
                  )}
                </div>
                <span className="ml-2 text-xs text-gray-400 capitalize">
                  {result.type === 'ingredient-converter' && 'Converter'}
                  {result.type === 'pure-converter' && 'Tool'}
                  {result.type === 'ingredient-page' && 'Guide'}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* No results message */}
      {isOpen && query.trim().length > 0 && results.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-4">
          <p className="text-sm text-gray-600 text-center">
            No results found for &quot;{query}&quot;
          </p>
        </div>
      )}
    </div>
  );
}

