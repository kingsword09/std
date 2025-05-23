/**
 * A module for installing and managing binary executables.
 * Provides functionality to download, install and run binary files from URLs.
 * Handles tar.gz archives and manages binary versions in a configurable install directory.
 *
 * @module
 */

import { DenoDir } from "@deno/cache-dir";
import { exists, mkdirIfNotExists, recreateDirectory } from "@kingsword/nodekit/fs";
import * as path from "@std/path";
import { UntarStream } from "@std/tar/untar-stream";

/**
 * Configuration options for the Binary class.
 */
export type BinaryConfig = { installDirectory: string; };

/**
 * A class for managing binary executables.
 * Provides methods to check if a binary exists, install it from a URL, and run it.
 *
 * @example
 * ```ts
 * const binary = new Binary("wasm-pack", "URL_ADDRESS.com/rustwasm/wasm-pack/releases/download/v0.13.1/wasm-pack-v0.13.1-x86_64-apple-darwin.tar.gz", "v0.13.1");
 * binary.install();
 * binary.run();
 * ```
 *
 * @class
 *
 * @param name The name of the binary.
 * @param url The URL of the binary.
 * @param version The version of the binary.
 * @param config The configuration options for the Binary class.
 *
 * @method exists Checks if the binary exists.
 * @method install Installs the binary from the URL.
 * @method run Runs the binary.
 *
 * @throws {Error} If the binary is not installed.
 *
 * @returns A Promise that resolves when the binary is installed.
 */
export class Binary {
  #config: BinaryConfig;
  #binaryPath: string;
  constructor(public name: string, public url: string, public version: string, config?: BinaryConfig) {
    if (!config) {
      const denoDir = new DenoDir();
      this.#config = { installDirectory: path.join(denoDir.root, ".bin") };
    } else {
      this.#config = config;
    }

    mkdirIfNotExists.sync(this.#config.installDirectory);

    this.#binaryPath = path.join(this.#config.installDirectory, `${this.name}-${this.version}`, this.name);

    Deno.permissions.requestSync({ name: "run", command: this.#binaryPath });
  }

  /**
   * Checks if the binary exists.
   *
   * @returns A boolean indicating whether the binary exists.
   */
  exists(): boolean {
    return exists.sync(this.#binaryPath);
  }

  /**
   * Installs the binary from the URL.
   *
   * @param fetchOptions The options for the fetch request.
   * @param suppressLogs Whether to suppress the installation logs.
   *
   * @returns A Promise that resolves when the binary is installed.
   */
  install(fetchOptions: RequestInit = {}, suppressLogs: boolean = false): Promise<void> {
    if (this.exists()) {
      if (!suppressLogs) {
        console.error(`${this.name} is already installed, skipping installation.`);
      }
      return Promise.resolve();
    }

    recreateDirectory.sync(this.#config.installDirectory);

    if (!suppressLogs) {
      console.error(`Downloading release from ${this.url}`);
    }

    return fetch(this.url, fetchOptions).then(async (res) => {
      const untarStream = res.body?.pipeThrough(new DecompressionStream("gzip")).pipeThrough(new UntarStream());
      if (untarStream) {
        for await (const entry of untarStream) {
          const parts = entry.path.split("/");
          const strippedPath = parts.length > 1 ? parts.slice(1).join("/") : entry.path;
          const untarFilePath = path.join(this.#binaryPath, strippedPath);
          await Deno.mkdir(path.dirname(untarFilePath), { recursive: true });
          await entry.readable?.pipeTo((await Deno.create(untarFilePath)).writable);
        }
        return;
      } else {
        return new Error("Failed to create untar stream");
      }
    }).then(() => {
      if (!suppressLogs) {
        console.error(`${this.name} has been installed!`);
      }
    }).catch((e) => {
      console.error(`Failed to install ${this.name}:`, e);
      Deno.exit(1);
    });
  }

  /**
   * Runs the binary.
   *
   * @param fetchOptions The options for the fetch request.
   *
   * @returns A Promise that resolves when the binary is run.
   */
  run(fetchOptions: RequestInit = {}) {
    const promise = !this.exists() ? this.install(fetchOptions, true) : Promise.resolve();
    promise.then(async () => {
      await Deno.chmod(this.#binaryPath, 0o755);
      const [, , ...args] = Deno.args;
      const command = new Deno.Command(this.#binaryPath, { cwd: Deno.cwd(), stdin: "inherit", args });
      const child = command.spawn();
      const status = await child.status;

      Deno.exit(status.code);
    }).catch(e => {
      console.error("Install or run failed:", e);
      Deno.exit(1);
    });
  }
}
