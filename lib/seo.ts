import type { Metadata } from 'next';
import { getSiteUrl } from './site';

const SITE_NAME = 'CookConvert';
const DEFAULT_DESCRIPTION_SUFFIX = 'Free cooking measurement converter for bakers and chefs.';
const BENEFIT_SUFFIX = 'Instant conversion, accurate density values, printable chart, and common kitchen units. Updated 2026.';
const MAX_DESCRIPTION_LENGTH = 155;
const MAX_TITLE_LENGTH = 65;

/**
 * Normalize pathname for canonical URLs (aligned with next.config trailingSlash: true)
 * - Strips query and hash
 * - Trims whitespace
 * - Collapses multiple leading slashes to a single "/"
 * - Ensures it starts with "/"
 * - Root stays "/"; non-root paths MUST end with "/" so canonical matches served URL
 */
function normalizePathname(pathname: string): string {
  let normalized = pathname.split('?')[0].split('#')[0].trim();
  // Collapse multiple leading slashes to a single "/"
  normalized = normalized.replace(/^\/+/, '/');
  // Ensure it starts with "/"
  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }
  // Root: stay "/"
  if (normalized === '/') {
    return normalized;
  }
  // Non-root: ensure single trailing slash (canonical = final served URL)
  normalized = normalized.replace(/\/+$/, '') + '/';
  return normalized;
}

/**
 * Truncate string at word boundary to fit max length (no ellipsis).
 * Used for meta descriptions.
 */
function truncateAtWordBoundary(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  const truncated = text.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace);
  }
  return truncated;
}

/**
 * Safe title trim: cap at maxLength without cutting mid-word.
 * Exported for optional use when building page titles before buildTitle.
 */
export function trimTitle(title: string, maxLength: number = MAX_TITLE_LENGTH): string {
  const t = title.trim();
  if (t.length <= maxLength) return t;
  const cut = t.substring(0, maxLength);
  const lastSpace = cut.lastIndexOf(' ');
  if (lastSpace > 0) return cut.substring(0, lastSpace).trim();
  return cut;
}

/**
 * Build a page title with site name suffix, trimmed to SERP-friendly length.
 */
export function buildTitle({ pageTitle }: { pageTitle: string }): string {
  const full = `${pageTitle.trim()} - ${SITE_NAME}`;
  return trimTitle(full, MAX_TITLE_LENGTH);
}

/**
 * Build a meta description with benefit-driven suffix and safe length.
 * - Appends BENEFIT_SUFFIX when not already present
 * - Truncates at word boundary to <= MAX_DESCRIPTION_LENGTH
 */
export function buildDescription({ description }: { description: string }): string {
  let finalDescription = description.trim();
  const hasBenefit = finalDescription.toLowerCase().includes('instant conversion') ||
                    finalDescription.toLowerCase().includes('updated 2026');
  if (!hasBenefit) {
    if (!finalDescription.endsWith('.') && !finalDescription.endsWith(',')) {
      finalDescription = `${finalDescription}.`;
    }
    finalDescription = `${finalDescription} ${BENEFIT_SUFFIX}`;
  }
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
