/**
 * File System Utilities
 * @module
 */

import type { Buffer } from "node:buffer";
import node_fs from "node:fs";
import node_path from "node:path";
import { quansync, type QuansyncFn } from "quansync";
import { normalizePath } from "./path.ts";

// #region readFile
/**
 * Using Proxy to intercept file path arguments and normalize them before passing to Node.js fs functions
 * This ensures consistent path handling across different platforms
 */
const readFileSync = new Proxy(node_fs.readFileSync, {
  apply(target, thisArg, argArray) {
    if (typeof argArray[0] === "string") {
      argArray[0] = normalizePath(argArray[0]);
    }
    return Reflect.apply(target, thisArg, argArray);
  },
});

/**
 * Using Proxy to intercept file path arguments and normalize them before passing to Node.js fs functions
 * This ensures consistent path handling across different platforms
 */
const readFileAsync = new Proxy(node_fs.promises.readFile, {
  apply(target, thisArg, argArray) {
    if (typeof argArray[0] === "string") {
      argArray[0] = normalizePath(argArray[0]);
    }
    return Reflect.apply(target, thisArg, argArray);
  },
});

/**
 * Read file content from filesystem
 * @see {@link https://nodejs.org/api/fs.html#fspromisesreadfilepath-options}
 * @see {@link https://github.com/quansync-dev/fs/blob/cf367ffed0d98716fa1c831ea78f996e3a89dd19/src/index.ts#L22}
 * @example
 * ```ts
 * import { readFile } from "jsr:@kingsword/nodekit/fs";
 *
 * // Sync
 * const content = readFile.sync("file.txt");
 * console.log(content);
 *
 * // Async
 * const content = await readFile.async("file.txt");
 * console.log(content);
 * ```
 *
 * @param path - File path to read
 * @param options - Encoding options for reading the file
 * @returns File content as string or buffer depending on encoding
 */
export const readFile = quansync({
  sync: readFileSync,
  // deno-lint-ignore no-explicit-any
  async: readFileAsync as any,
}) as
  & QuansyncFn<
    Buffer,
    [path: node_fs.PathLike, options?: { encoding?: null | undefined; flag?: string | undefined; } | null]
  >
  & QuansyncFn<
    string,
    [
      path: node_fs.PathLike,
      options: { encoding: NodeJS.BufferEncoding; flag?: string | undefined; } | NodeJS.BufferEncoding,
    ]
  >;
// #endregion

// #region writeFileSimple
/**
 * Options for writeFileSimple
 */
export type WriteFileSimpleOptions = node_fs.WriteFileOptions & { mkdirIfNotExists?: boolean; };
/**
 * Using Proxy to intercept file path arguments and normalize them before passing to Node.js fs functions
 * This ensures consistent path handling across different platforms
 */
const writeFileSync = new Proxy(node_fs.writeFileSync, {
  apply(target, thisArg, argArray) {
    if (typeof argArray[0] === "string") {
      if (argArray[2] && argArray[2].mkdirIfNotExists) {
        mkdirIfNotExists.sync(argArray[0]);
      }
      argArray[0] = normalizePath(argArray[0]);
    }

    return Reflect.apply(target, thisArg, argArray);
  },
});
/**
 * Using Proxy to intercept file path arguments and normalize them before passing to Node.js fs functions
 * This ensures consistent path handling across different platforms
 */
const writeFileAsync = new Proxy(node_fs.promises.writeFile, {
  apply(target, thisArg, argArray) {
    if (typeof argArray[0] === "string") {
      if (argArray[2] && argArray[2].mkdirIfNotExists) {
        mkdirIfNotExists.sync(argArray[0]);
      }
      argArray[0] = normalizePath(argArray[0]);
    }

    return Reflect.apply(target, thisArg, argArray);
  },
});

/**
 * Write file content to filesystem
 *
 * @example
 * ```ts
 * import { writeFileSimple } from "jsr:@kingsword/nodekit/fs";
 *
 * // Sync
 * writeFileSimple.sync("file.txt", "Hello World");
 *
 * // Async
 * await writeFileSimple.async("file.txt", "Hello World");
 * ```
 *
 * @param path - File path to write
 * @param data - File content to write
 * @param options - Write file option
 * @returns void
 */
export const writeFileSimple = quansync({
  sync: writeFileSync,
  // deno-lint-ignore no-explicit-any
  async: writeFileAsync as any,
}) as QuansyncFn<void, [path: node_fs.PathOrFileDescriptor, data: string, options?: WriteFileSimpleOptions]>;
// #endregion

// #region exists
/**
 * Check if a file or directory exists at the given path
 * @see {@link https://github.com/rolldown/tsdown/blob/7878fdfc0d718b424f5523049f22b003b65e9084/src/utils/fs.ts#L4}
 * @param path - Path to check for existence
 * @returns Boolean indicating if path exists
 */
const existsAsync = (path: string): Promise<boolean> => {
  return node_fs.promises.access(normalizePath(path)).then(() => true, () => false);
};

/**
 * Check if a file or directory exists at the given path
 *
 * @example
 * ```ts
 * import { exists } from "jsr:@kingsword/nodekit/fs";
 *
 * // Sync
 * const isExists = exists.sync("file.txt");
 * console.log(isExists);
 *
 * // Async
 * const isExists = await exists.async("file.txt");
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
// #endregion

// #region mkdirIfNotExists
/**
 * Create a directory if it does not exist synchronously
 */
const mkdirIfNotExistsSync = (path: string) => {
  const normalizedPath = normalizePath(path);
  if (!exists(normalizedPath)) {
    node_fs.mkdirSync(normalizedPath, { recursive: true });
  }
};

/**
 * Create a directory if it does not exist asynchronously
 */
const mkdirIfNotExistsAsync = async (path: string) => {
  const normalizedPath = normalizePath(path);
  if (!await exists.async(normalizedPath)) {
    await node_fs.promises.mkdir(normalizedPath, { recursive: true });
  }
};

/**
 * Create a directory if it does not exist
 *
 * @example
 * ```ts
 * import { mkdirIfNotExists } from "jsr:@kingsword/nodekit/fs";
 *
 * // Sync
 * mkdirIfNotExists.sync("./foo/bar/baz.txt");
 *
 * // Async
 * await mkdirIfNotExists.async("./foo/bar/baz.txt");
 * ```
 *
 * @param path - Path to create directory
 * @returns void
 */
export const mkdirIfNotExists: QuansyncFn<void, [path: string]> = quansync({
  sync: mkdirIfNotExistsSync,
  async: mkdirIfNotExistsAsync,
});
// #endregion mkdirIfNotExists
