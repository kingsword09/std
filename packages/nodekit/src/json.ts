/**
 * JSON Utilities
 * @module
 */

import { parse } from "@std/jsonc";
import { quansync, type QuansyncAwaitableGenerator, type QuansyncFn } from "quansync";
import { readFile, writeFileSimple } from "./fs.ts";

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
export const readJson = quansync(function*<T>(path: string) {
  const content = yield* readFile(path, { encoding: "utf-8" });
  return parse(content) as T;
}) as {
  <T>(path: string): QuansyncAwaitableGenerator<T>;
  sync: <T>(path: string) => T;
  async: <T>(path: string) => Promise<T>;
};

/**
 * Write json or jsonc file content to filesystem
 *
 * @example
 * ```ts
 * import { writeJson } from "jsr:@kingsword09/nodekit/fs";
 *
 * // Sync
 * writeJson.sync("./file.json", JSON.stringify({ a: 1 }, null, 2));
 *
 * // Async
 * await writeJson.async("./file.jsonc", JSON.stringify({ a: 1 }, null, 2));
 * ```
 *
 * @param path - json or jsonc file path to write
 * @param data - json or jsonc content to write
 * @returns void
 */
export const writeJson: QuansyncFn<void, [path: string, data: string]> = quansync(
  function*(path: string, data: string) {
    yield* writeFileSimple(path, data, { encoding: "utf-8" });
  },
);
