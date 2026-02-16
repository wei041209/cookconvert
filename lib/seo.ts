import type { Metadata } from 'next';
import { getSiteUrl } from './site';

const SITE_NAME = 'CookConvert';
const DEFAULT_DESCRIPTION_SUFFIX = 'Free cooking measurement converter for bakers and chefs.';
const MAX_DESCRIPTION_LENGTH = 155;

/**
 * Normalize pathname for canonical URLs
 * - Trims whitespace
 * - Collapses multiple leading slashes to a single "/"
 * - Ensures it starts with "/"
 * - Removes trailing "/" except when pathname === "/"
 */
function normalizePathname(pathname: string): string {
  let normalized = pathname.trim();
  
  // Collapse multiple leading slashes to a single "/"
  normalized = normalized.replace(/^\/+/, '/');
  
  // Ensure it starts with "/"
  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }
  
  // Remove trailing "/" except for root
  if (normalized !== '/' && normalized.endsWith('/')) {
    normalized = normalized.replace(/\/+$/, '');
  }
  
  return normalized;
}

/**
 * Truncate string at word boundary to fit max length
 */
function truncateAtWordBoundary(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  
  // Find last space before maxLength
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > 0) {
    return `${truncated.substring(0, lastSpace)}…`;
  }
  
  // If no space found, truncate and add ellipsis
  return `${truncated}…`;
}

/**
 * Build a page title with site name suffix
 */
export function buildTitle({ pageTitle }: { pageTitle: string }): string {
  return `${pageTitle} - ${SITE_NAME}`;
}

/**
 * Build a meta description with suffix, avoiding duplication
 * - Appends DEFAULT_DESCRIPTION_SUFFIX if not already present
 * - Ensures final description is <= 155 characters (truncates at word boundary if needed)
 */
export function buildDescription({ description }: { description: string }): string {
  let finalDescription = description.trim();
  
  // Check if description already contains "CookConvert" or the suffix meaningfully
  const hasCookConvert = finalDescription.toLowerCase().includes('cookconvert');
  const hasSuffixMeaning = finalDescription.toLowerCase().includes('free cooking measurement converter') ||
                          finalDescription.toLowerCase().includes('for bakers and chefs');
  
  // Append suffix if not duplicated
  if (!hasCookConvert && !hasSuffixMeaning) {
    // Ensure description ends with period before appending
    if (!finalDescription.endsWith('.')) {
      finalDescription = `${finalDescription}.`;
    }
    finalDescription = `${finalDescription} ${DEFAULT_DESCRIPTION_SUFFIX}`;
  } else if (!finalDescription.endsWith('.')) {
    // Just ensure it ends with period if suffix not appended
    finalDescription = `${finalDescription}.`;
  }
  
  // Truncate to max length if needed (soft cap at word boundary)
  if (finalDescription.length > MAX_DESCRIPTION_LENGTH) {
    finalDescription = truncateAtWordBoundary(finalDescription, MAX_DESCRIPTION_LENGTH);
  }
  
  return finalDescription;
}

/**
 * Build a canonical URL for a pathname
 * Uses normalized pathname to ensure consistency
 */
export function buildCanonical(pathname: string): string {
  const siteUrl = getSiteUrl();
  const normalizedPath = normalizePathname(pathname);
  return `${siteUrl}${normalizedPath}`;
}

/**
 * Build Open Graph metadata
 */
export function buildOpenGraph({
  title,
  description,
  pathname,
}: {
  title: string;
  description: string;
  pathname: string;
}): Metadata['openGraph'] {
  // buildCanonical() already normalizes the pathname, so no need to normalize here
  return {
    title,
    description,
    url: buildCanonical(pathname),
    siteName: SITE_NAME,
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: `${title}`,
      },
    ],
  };
}

/**
 * Build Twitter Card metadata
 */
export function buildTwitter({
  title,
  description,
}: {
  title: string;
  description: string;
}): Metadata['twitter'] {
  return {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og.png'],
  };
}

/**
 * Build complete metadata object for a page
 */
export function buildMetadata({
  pageTitle,
  description,
  pathname,
}: {
  pageTitle: string;
  description: string;
  pathname: string;
}): Metadata {
  const title = buildTitle({ pageTitle });
  const metaDescription = buildDescription({ description });
  const normalizedPath = normalizePathname(pathname);
  
  return {
    metadataBase: new URL(getSiteUrl()),
    title,
    description: metaDescription,
    alternates: {
      canonical: buildCanonical(normalizedPath),
    },
    openGraph: buildOpenGraph({
      title,
      description: metaDescription,
      pathname: normalizedPath,
    }),
    twitter: buildTwitter({
      title,
      description: metaDescription,
    }),
  };
}
