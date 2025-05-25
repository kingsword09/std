/**
 * Download and extract utilities.
 *
 * @module
 */

import * as path from "@std/path";
import { UntarStream } from "@std/tar/untar-stream";

interface DownloadOptions {
  url: string;
  fetchOptions?: RequestInit;
  destPath?: string;
  stripLevel?: number; // Number of leading path components to strip from the extracted files.
}

/**
 * Downloads a tar.gz file from a URL and extracts it to a destination path.
 *
 * @example
 * ```ts
 * import { downloadAndExtractTarGz } from "@kingsword/denokit/download";
 *
 * const destPath = await downloadAndExtractTarGz({
 *   url: "@example.com/foo.tar.gz",
 *   fetchOptions: {
 *     headers: {
 *       "Authorization": "Bearer <token>",
 *     },
 *   },
 *   destPath: "/tmp/foo",
 *   stripLevel: 1,
 * });
 * ```
 *
 * @param options The options for the download.
 * @param options.url The URL of the tar.gz file to download.
 * @param options.fetchOptions The options for the fetch request.
 * @param options.destPath The destination path to extract the tar.gz file to. If not provided, a temporary directory will be created.
 * @param options.stripLevel The number of leading path components to strip from the extracted files.
 *
 * @returns A Promise that resolves to the destination path where the tar.gz file was extracted.
 */
export const downloadAndExtractTarGz = async (
  { url, fetchOptions = {}, destPath, stripLevel = 1 }: DownloadOptions,
): Promise<string> => {
  if (!url.startsWith("http")) {
    throw new Error(`Invalid URL: ${url}`);
  }

  const res = await fetch(url, fetchOptions);

  if (!res.ok) {
    throw new Error(`Failed to download ${url}: ${res.statusText}`);
  }

  const untarStream = res.body?.pipeThrough(new DecompressionStream("gzip")).pipeThrough(new UntarStream());

  if (untarStream) {
    try {
      let dest = destPath;
      if (!dest) {
        dest = await Deno.makeTempDir({ prefix: `denokit-download-${Date.now()}` });
      }

      for await (const entry of untarStream) {
        const parts = entry.path.split("/");
        const strippedPath = parts.length > stripLevel ? parts.slice(stripLevel).join("/") : entry.path;
        const untarFilePath = path.join(dest, strippedPath);

        await Deno.mkdir(path.dirname(untarFilePath), { recursive: true });
        await entry.readable?.pipeTo((await Deno.create(untarFilePath)).writable);
      }

      return dest;
    } catch (error) {
      throw new Error(`Failed to extract tar.gz: ${error}`);
    }
  } else {
    throw new Error("Failed to create untar stream");
  }
};
