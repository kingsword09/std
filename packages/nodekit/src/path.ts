import node_path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Normalize path to be compatible with Deno
 *
 * @example
 * ```ts
 * import { normalizePath } from "jsr:@kingsword09/nodekit/path";
 *
 * normalizePath("file:///home/user"); // "/home/user"
 * normalizePath("/home/user"); // "/home/user"
 * normalizePath("file:///home/user/test.json"); // "/home/user/test.json"
 * ```
 *
 * @param path - Path to normalize
 * @returns Normalized path
 */
export const normalizePath = (path: string) => {
  if (path.startsWith("file://")) {
    return fileURLToPath(path);
  }

  return node_path.normalize(path);
};
