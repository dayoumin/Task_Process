/**
 * Safe deep clone helper with structuredClone fallback
 * Provides browser compatibility for older environments
 */

/**
 * Deep clone an object using structuredClone with JSON fallback
 * @param obj - Object to clone
 * @returns Deep cloned copy
 */
export function deepClone<T>(obj: T): T {
  // Use native structuredClone if available (Chrome 98+, Firefox 94+, Safari 15.4+)
  if (typeof structuredClone !== 'undefined') {
    return structuredClone(obj);
  }

  // Fallback to JSON methods for older browsers
  // Note: This loses functions, symbols, and some object types
  return JSON.parse(JSON.stringify(obj)) as T;
}
