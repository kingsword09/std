import node_fs from "node:fs";
import { quansync, type QuansyncFn } from "quansync";
import { normalizePath } from "./path.ts";
import type { Buffer } from "node:buffer";

/**
 * Read file content from filesystem
 *
 * @example
 * ```ts
 * import { readFile } from "jsr:@kingsword09/nodekit/fs";
 *
 * #### Sync
 * const content = readFile.sync("file.txt");
 * console.log(content);
 *
 * #### Async
 * const content = await readFile.async("file.txt");
 * console.log(content);
 * ```
 *
 * @param path - File path to read
 * @param options - Encoding options for reading the file
 * @returns File content as string or buffer depending on encoding
 */
export const readFile: QuansyncFn<
  string | Buffer<ArrayBufferLike>,
  [path: string, options?: node_fs.ObjectEncodingOptions | undefined]
> = quansync({
  sync: (
    path: string,
    options: node_fs.ObjectEncodingOptions = { encoding: "utf-8" },
  ) =>
    node_fs.readFileSync(normalizePath(path), { encoding: options.encoding }),
  async: (
    path: string,
    options: node_fs.ObjectEncodingOptions = { encoding: "utf-8" },
  ) =>
    node_fs.promises.readFile(normalizePath(path), {
      encoding: options.encoding,
    }),
});

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
 * #### Sync
 * const isExists = exists.sync("file.txt");
 * console.log(isExists);
 *
 * #### Async
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
