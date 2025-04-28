/**
 * JSON Utilities
 * @module
 */

import { parse } from "@std/jsonc";
import { quansync, type QuansyncAwaitableGenerator } from "quansync";
import { readFileString } from "./fs.ts";

/**
 * Read json or jsonc file content from filesystem
 *
 * @example
 * ```ts
 * import { readJson } from "jsr:@kingsword09/nodekit/fs";
 *
 * // Sync
 * const content = readJson.sync("./file.json");
 * console.log(content);
 *
 * // Async
 * const content = await readJson.async("./file.jsonc");
 * console.log(content);
 * ```
 *
 * @param path - json or jsonc file path to read
 * @returns json or jsonc content as object
 */
export const readJson = quansync(function* <T>(path: string) {
  const content = yield* readFileString(path);
  return parse(content) as T;
}) as {
  <T>(path: string): QuansyncAwaitableGenerator<T>;
  sync: <T>(path: string) => T;
  async: <T>(path: string) => Promise<T>;
};
