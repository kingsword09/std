import node_fs from "node:fs";
import { quansync } from "npm:quansync";
import { normalizePath } from "./path.ts";

/**
 * Read file content from filesystem
 * @param path - File path to read
 * @param options - Encoding options for reading the file
 * @returns File content as string or buffer depending on encoding
 */
export const readFile = quansync({
  sync: (
    path: string,
    options: node_fs.ObjectEncodingOptions = { encoding: "utf-8" }
  ) =>
    node_fs.readFileSync(normalizePath(path), { encoding: options.encoding }),
  async: (
    path: string,
    options: node_fs.ObjectEncodingOptions = { encoding: "utf-8" }
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
const existsAsync = (path: string) => {
  return node_fs.promises.access(normalizePath(path)).then(
    () => true,
    () => false
  );
};

/**
 * Check if a file or directory exists at the given path
 * @param path - Path to check for existence
 * @returns Boolean indicating if path exists
 */
export const exists = quansync({
  sync: (path: string) => node_fs.existsSync(normalizePath(path)),
  async: (path: string) => existsAsync(normalizePath(path)),
});
