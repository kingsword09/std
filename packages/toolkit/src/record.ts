/**
 * Record utility functions
 * 
 * @module
 */

/**
 * Transforms a record by applying a function to each key-value pair
 * 
 * @example
 * ```ts
 * const obj = { a: 1, b: 2, c: 3 };
 * const transformedObj = transformRecordEntries(obj, (key, value) => value * 2);
 * // transformedObj is { a: 2, b: 4, c: 6 }
 * ```
 * 
 * @param entries The input record to transform
 * @param func The transformation function that takes a key and value and returns a new value
 * @returns A new record with transformed values
 */
export const transformRecordEntries = <T, R>(
  entries: Record<string, T>,
  func: (key: string, value: T) => R,
): Record<string, R> => {
  const result: Record<string, R> = {};
  for (const [key, value] of Object.entries(entries)) {
    result[key] = func(key, value);
  }
  return result;
};
