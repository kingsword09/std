/**
 * JSON Utilities
 * @module
 */

import { parse } from "@std/jsonc";
import { readFile } from "./fs.ts";

export interface ReadJson {
  sync<T>(path: string): T;
  async<T>(path: string): Promise<T>;
}

/**
 * Read json or jsonc file content from filesystem
 *
 * @example
 * ```ts
 * import { readJson } from "jsr:@kingsword09/nodekit/fs";
 *
 * // Sync
 * const content = readJson("./file.json").sync();
 * console.log(content);
 *
 * // Async
 * const content = await readJson("./file.jsonc").async();
 * console.log(content);
 * ```
 *
 * @param path - json or jsonc file path to read
 * @returns json or jsonc content as object
 */
export const readJson: ReadJson = Object.assign({
  sync<T>(path: string): T {
    const content = readFile.sync(path, { encoding: "utf-8" });
    return parse(content) as T;
  },
  async async<T>(path: string): Promise<T> {
    const content = await readFile.async(path, { encoding: "utf-8" });
    return parse(content) as T;
  },
});
