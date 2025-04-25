/**
 * @see {@link https://github.com/dsherret/deno-which/blob/dd5239be39174238b66d1d031356b6729aa3276a/mod.ts}
 */

import node_process from "node:process";
import node_fs from "node:fs";
import { quansync, type QuansyncFn } from "quansync";
import { normalizePath } from "./path.ts";

export interface Environment {
  /** Gets an environment variable. */
  env(key: string): string | undefined;
  /** Resolves the `NodeFS.Dirent` for the specified
   * path following symlinks.
   */
  stat(filePath: string): Promise<Pick<node_fs.Dirent, "isFile">>;
  /** Synchronously resolves the `NodeFS.Dirent` for
   * the specified path following symlinks.
   */
  statSync(filePath: string): Pick<node_fs.Dirent, "isFile">;
  /** Gets the current operating system. */
  os: typeof node_process.platform;
  /** Optional method for requesting broader permissions for a folder
   * instead of asking for each file when the operating system requires
   * probing multiple files for an executable path.
   *
   * This is not the default, but is useful on Windows for example.
   */
  requestPermission?(folderPath: string): void;
}

/** Default implementation that interacts with the file system and process env vars. */
export class RealEnvironment implements Environment {
  env(key: string): string | undefined {
    return node_process.env[key];
  }

  stat(path: string): Promise<Pick<node_fs.Dirent, "isFile">> {
    return node_fs.promises.stat(normalizePath(path));
  }

  statSync(path: string): Pick<node_fs.Dirent, "isFile"> {
    return node_fs.statSync(normalizePath(path));
  }

  get os(): typeof node_process.platform {
    return node_process.platform;
  }
}

/** Finds the path to the specified command asynchronously. */
export async function whichAsync(
  command: string,
  environment: Omit<Environment, "statSync"> = new RealEnvironment(),
): Promise<string | undefined> {
  const systemInfo = getSystemInfo(command, environment);
  if (systemInfo == null) {
    return undefined;
  }

  for (const pathItem of systemInfo.pathItems) {
    const filePath = pathItem + command;
    if (systemInfo.pathExts) {
      environment.requestPermission?.(pathItem);

      for (const pathExt of systemInfo.pathExts) {
        const filePath = pathItem + command + pathExt;
        if (await pathMatches(environment, filePath)) {
          return filePath;
        }
      }
    } else if (await pathMatches(environment, filePath)) {
      return filePath;
    }
  }

  return undefined;
}

async function pathMatches(
  environment: Omit<Environment, "statSync">,
  path: string,
): Promise<boolean> {
  try {
    const result = await environment.stat(path);
    return result.isFile();
  } catch (_err) {
    return false;
  }
}

/** Finds the path to the specified command synchronously. */
export function whichSync(
  command: string,
  environment: Omit<Environment, "stat"> = new RealEnvironment(),
): string | undefined {
  const systemInfo = getSystemInfo(command, environment);
  if (systemInfo == null) {
    return undefined;
  }

  for (const pathItem of systemInfo.pathItems) {
    const filePath = pathItem + command;
    if (systemInfo.pathExts) {
      environment.requestPermission?.(pathItem);

      for (const pathExt of systemInfo.pathExts) {
        const filePath = pathItem + command + pathExt;
        if (pathMatchesSync(environment, filePath)) {
          return filePath;
        }
      }
    } else if (pathMatchesSync(environment, filePath)) {
      return filePath;
    }
  }

  return undefined;
}

function pathMatchesSync(
  environment: Omit<Environment, "stat">,
  path: string,
): boolean {
  try {
    const result = environment.statSync(path);
    return result.isFile();
  } catch (_err) {
    return false;
  }
}

interface SystemInfo {
  pathItems: string[];
  pathExts: string[] | undefined;
  isNameMatch: (a: string, b: string) => boolean;
}

function getSystemInfo(
  command: string,
  environment: Omit<Environment, "stat" | "statSync">,
): SystemInfo | undefined {
  const isWindows = environment.os === "win32";
  const envValueSeparator = isWindows ? ";" : ":";
  const path = environment.env("PATH");
  const pathSeparator = isWindows ? "\\" : "/";
  if (path == null) {
    return undefined;
  }

  return {
    pathItems: splitEnvValue(path).map((item) => normalizeDir(item)),
    pathExts: getPathExts(),
    isNameMatch: isWindows
      ? (a, b) => a.toLowerCase() === b.toLowerCase()
      : (a, b) => a === b,
  };

  function getPathExts() {
    if (!isWindows) {
      return undefined;
    }

    const pathExtText = environment.env("PATHEXT") ?? ".EXE;.CMD;.BAT;.COM";
    const pathExts = splitEnvValue(pathExtText);
    const lowerCaseCommand = command.toLowerCase();

    for (const pathExt of pathExts) {
      // Do not use the pathExts if someone has provided a command
      // that ends with the extenion of an executable extension
      if (lowerCaseCommand.endsWith(pathExt.toLowerCase())) {
        return undefined;
      }
    }

    return pathExts;
  }

  function splitEnvValue(value: string) {
    return value
      .split(envValueSeparator)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  function normalizeDir(dirPath: string) {
    if (!dirPath.endsWith(pathSeparator)) {
      dirPath += pathSeparator;
    }
    return dirPath;
  }
}

/**
 * Finds the path to the specified command, supporting both synchronous and asynchronous usage.
 * Returns the absolute path to the executable if found, otherwise returns undefined.
 * This function is a "quansync" wrapper, so you can use it in both sync and async contexts.
 *
 * @example
 * ```ts
 * import { which } from "jsr:@kingsword09/nodekit/which";
 *
 * #### Sync
 * const commandPath = which.sync("deno");
 * console.log(commandPath); // "/path/to/deno"
 *
 * #### Async
 * const commandPath = await which.async("deno");
 * console.log(commandPath); // "/path/to/deno"
 * ```
 *
 * @param command - The name of the command to search for in the system PATH.
 * @returns The absolute path to the command if found, otherwise undefined.
 */
export const which: QuansyncFn<string | undefined, [command: string]> =
  quansync({
    sync: (command: string) => whichSync(command),
    async: (command: string) => whichAsync(command),
  });
