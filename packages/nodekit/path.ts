import node_path from "node:path";
import { fileURLToPath } from "node:url";

/**
 * Normalize path to be compatible with Deno
 * @param path - Path to normalize
 * @returns Normalized path
 */
export const normalizePath = (path: string) => {
  if (path.startsWith("file://")) {
    return fileURLToPath(path);
  }

  return node_path.normalize(path);
};
