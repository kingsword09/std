import { DenoDir } from "@deno/cache-dir";
import { exists, mkdirIfNotExists, recreateDirectory } from "@kingsword/nodekit/fs";
import * as path from "@std/path";
import { UntarStream } from "@std/tar/untar-stream";

export type BinaryConfig = { installDirectory: string; };

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

  exists(): boolean {
    return exists.sync(this.#binaryPath);
  }

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
