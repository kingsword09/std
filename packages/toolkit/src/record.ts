/**
 * Record utility functions
 *
 * @module
 */

/**
 * Transforms a record by applying a function to each key-value pair. The function can optionally transform both keys and values.
 *
 * @example
 * ```ts
 * const obj = { a: 1, b: 2, c: 3 };
 * const transformedObj = transformRecordEntries(obj, ({value}) => value * 2);
 * // transformedObj is { a: 2, b: 4, c: 6 }
 * ```
 *
 * @param entries The input record to transform
 * @param func The transformation function that takes an object containing key, value and index, and returns a new value or undefined
 * @param keyTransformer Optional function to transform keys in the resulting record
 * @returns A new record with transformed keys and/or values, excluding entries where the transform function returns undefined
 */
export const transformRecordEntries = <T, R>(
  entries: Record<string, T>,
  func: (entry: { key: string; value: T; index: number; }) => R | undefined,
  keyTransformer?: (key: string) => string,
): Record<string, R> => {
  const result: Record<string, R> = {};
  Object.entries(entries).forEach((entry, index) => {
    const [key, value] = entry;
    const res = func({ key, value, index });
    if (res !== undefined) {
      if (keyTransformer) {
        result[keyTransformer(key)] = res;
      } else {
        result[key] = res;
      }
    }
  });
  return result;
};
