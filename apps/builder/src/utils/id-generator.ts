/**
 * Thread-safe ID generator that prevents race conditions
 * Uses a counter to ensure uniqueness even when called rapidly
 */

let counter = 0;
let lastTimestamp = 0;

export function generateUniqueId(prefix = 'id'): string {
  const now = Date.now();

  // Reset counter if we're in a new millisecond
  if (now !== lastTimestamp) {
    counter = 0;
    lastTimestamp = now;
  } else {
    counter++;
  }

  // Format: prefix-timestamp-counter
  return `${prefix}-${now}-${counter}`;
}

/**
 * Generate a process ID with PROC prefix
 */
export function generateProcessId(): string {
  return generateUniqueId('process');
}

/**
 * Generate a node ID with type prefix
 */
export function generateNodeId(type: string): string {
  return generateUniqueId(type);
}