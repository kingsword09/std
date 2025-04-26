/**
 * File System Utilities
 * @module
 */

import node_fs from "node:fs";
import { quansync, type QuansyncFn } from "quansync";
import type { Buffer } from "node:buffer";
import { normalizePath } from "./path.ts";

//#region readFile
export interface ReadFile {
  sync(
    path: string,
    options?: { encoding?: null | undefined; flag?: string },
  ): Buffer;
  sync(
    path: string,
    options: { encoding: NodeJS.BufferEncoding; flag?: string },
  ): string;
  sync(
    path: string,
    options?: node_fs.ObjectEncodingOptions | NodeJS.BufferEncoding | null,
  ): string | Buffer;
  async(
    path: string,
    options?: { encoding?: null | undefined; flag?: string },
  ): Promise<Buffer>;
  async(
    path: string,
    options: { encoding: NodeJS.BufferEncoding; flag?: string },
  ): Promise<string>;
  async(
    path: string,
    options?: node_fs.ObjectEncodingOptions | NodeJS.BufferEncoding | null,
  ): Promise<string | Buffer>;
}

/**
 * Read file content from filesystem
 *
 * @example
 * ```ts
 * import { readFile } from "jsr:@kingsword09/nodekit/fs";
 *
 * // Sync
 * const content = readFile("file.txt").sync();
 * console.log(content);
 *
 * // Async
 * const content = await readFile("file.txt").async();
 * console.log(content);
 * ```
 *
 * @param path - File path to read
 * @param options - Encoding options for reading the file
 * @returns File content as string or buffer depending on encoding
 */
export const readFile: ReadFile = Object.assign({
  sync(
    path: string,
    options?: node_fs.ObjectEncodingOptions | NodeJS.BufferEncoding | null,
  ) {
    return node_fs.readFileSync(normalizePath(path), options);
  },
  async(
    path: string,
    options?: node_fs.ObjectEncodingOptions | NodeJS.BufferEncoding | null,
  ) {
    return node_fs.promises.readFile(normalizePath(path), options);
  },
});
//#endregion

//#region exists
/**
 * Check if a file or directory exists at the given path
 * @see {@link https://github.com/rolldown/tsdown/blob/7878fdfc0d718b424f5523049f22b003b65e9084/src/utils/fs.ts#L4}
 * @param path - Path to check for existence
 * @returns Boolean indicating if path exists
 */
const existsAsync = (path: string): Promise<boolean> => {
  return node_fs.promises.access(normalizePath(path)).then(
    () => true,
    () => false,
  );
};

/**
 * Check if a file or directory exists at the given path
 *
 * @example
 * ```ts
 * import { exists } from "jsr:@kingsword09/nodekit/fs";
 *
 * // Sync
 * const isExists = exists("file.txt").sync();
 * console.log(isExists);
 *
 * // Async
 * const isExists = await exists("file.txt").async();
 * console.log(isExists);
 * ```
 *
 * @param path - Path to check for existence
 * @returns Boolean indicating if path exists
 */
export const exists: QuansyncFn<boolean, [path: string]> = quansync({
  sync: (path: string) => node_fs.existsSync(normalizePath(path)),
  async: (path: string) => existsAsync(normalizePath(path)),
});
//#endregion
