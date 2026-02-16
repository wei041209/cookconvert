/**
 * Get the site URL, normalized for use in canonical URLs, sitemaps, and JSON-LD.
 * 
 * Environment variable priority:
 * 1. NEXT_PUBLIC_SITE_URL (primary)
 * 2. VERCEL_URL (prepend https://)
 * 3. CF_PAGES_URL (normalize)
 * 4. http://localhost:3000 (fallback)
 * 
 * Normalization:
 * - Trims whitespace
 * - Ensures protocol (defaults to https://, respects explicit http://)
 * - Removes trailing slash
 * - Safety: if empty after normalization, falls back to localhost
 * 
 * Protocol handling:
 * - Respects explicit http:// if user configured it (does not force https)
 * - Exception: In production, if url is http://localhost..., keeps as is
 */
export function getSiteUrl(): string {
  // Try environment variables in priority order
  let rawUrl: string | undefined;
  
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    rawUrl = process.env.NEXT_PUBLIC_SITE_URL;
  } else if (process.env.VERCEL_URL) {
    // Vercel provides domain without protocol, prepend https://
    rawUrl = `https://${process.env.VERCEL_URL}`;
  } else if (process.env.CF_PAGES_URL) {
    rawUrl = process.env.CF_PAGES_URL;
  }
  
  // If no URL found, use localhost fallback
  if (!rawUrl) {
    return 'http://localhost:3000';
  }
  
  // Normalize the URL
  let url = rawUrl.trim();
  
  // Safety check: if empty after trim, fallback to localhost
  if (!url) {
    return 'http://localhost:3000';
  }
  
  // Check for production localhost exception (keep as is, don't modify)
  const isProduction = process.env.NODE_ENV === 'production';
  const isLocalhostHttp = url.startsWith('http://') && url.includes('localhost');
  
  if (isProduction && isLocalhostHttp) {
    // In production with http://localhost..., keep as is (don't force https)
    // Just remove trailing slash and return
    url = url.replace(/\/+$/, '');
    return url || 'http://localhost:3000';
  }
  
  // Ensure protocol (default to https:// if missing)
  // Respect explicit http:// if user configured it (do not force https)
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  
  // Remove trailing slash
  url = url.replace(/\/+$/, '');
  
  // Final safety check: if somehow empty after normalization, fallback to localhost
  if (!url) {
    return 'http://localhost:3000';
  }
  
  return url;
}


