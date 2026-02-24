/**
 * Normalize a pathname for consistent URL generation
 * - Ensures leading "/"
 * - Removes trailing "/" unless path === "/"
 */
export function normalizePathname(path: string): string {
  let normalized = path.trim();
  
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


