/**
 * Command-related utilities for executing shell commands and handling their output.
 *
 * This module provides functions for running shell commands and processing their output,
 * with support for JSON parsing and custom output handling.
 *
 * @module
 */

import type { Buffer } from "node:buffer";
import { spawn, type SpawnOptionsWithoutStdio, spawnSync } from "node:child_process";
import process from "node:process";
import { which } from "./which.ts";

interface CommandOutputOptions {
  args?: readonly string[];
  cmdOpts?: Pick<SpawnOptionsWithoutStdio, "cwd" | "stdio" | "shell">;
  preHook?: (output: string) => string;
}

/**
 * Runs a command and returns the output.
 *
 * @example
 * ```ts
 * import { commandOutputWithJsonParserAsync } from "@kingsword/nodekit/command";
 *
 * const output = await commandOutputWithJsonParserAsync("npm", { args: ["view", "dwpkg", "--json"] });
 *
 * console.log(output);
 * ```
 *
 * @param command The command to run.
 * @param options The options to pass to the command.
 * @returns The output of the command.
 */
export const commandOutputWithJsonParserAsync = async <T extends unknown>(
  command: string,
  options: CommandOutputOptions,
) => {
  const { args, cmdOpts, preHook } = options;

  const child = spawn(await which.async(command) ?? command, args ?? [], {
    cwd: cmdOpts?.cwd ?? process.cwd(),
    stdio: ["ignore", "pipe", "pipe"],
    shell: cmdOpts?.shell ?? false,
  });

  const promise = Promise.withResolvers<string>();

  let stdout = "";
  child.stdout?.on("data", (data: Buffer) => {
    stdout += data.toString();
  });

  child.stderr?.on("data", (data: Buffer) => {
    throw new Error("Command failed " + data.toString());
  });

  child.on("error", (err) => {
    throw new Error("Command failed " + err);
  });
  child.on("close", (code) => {
    if (code !== 0) {
      throw new Error("Command failed with code " + code);
    }

    promise.resolve(stdout);
  });

  const output = preHook ? preHook(await promise.promise) : await promise.promise;
  return JSON.parse(output) as T;
};

/**
 * Runs a command and returns the output.
 *
 * @example
 * ```ts
 * import { commandOutputWithJsonParserSync } from "@kingsword/nodekit/command";
 *
 * const output = commandOutputWithJsonParserSync("npm", { args: ["view", "dwpkg", "--json"] });
 *
 * console.log(output);
 * ```
 *
 * @param command The command to run.
 * @param options The options to pass to the command.
 * @returns The output of the command.
 */
export const commandOutputWithJsonParserSync = <T extends unknown>(command: string, options: CommandOutputOptions) => {
  const { args, cmdOpts, preHook } = options;

  const child = spawnSync(which.sync(command) ?? command, args ?? [], {
    cwd: cmdOpts?.cwd ?? process.cwd(),
    stdio: ["ignore", "pipe", "pipe"],
    shell: cmdOpts?.shell ?? false,
    encoding: "utf-8",
  });

  if (child.error) {
    throw new Error("Command failed " + child.error);
  }
  if (child.status !== 0) {
    throw new Error("Command failed with code " + child.stderr);
  }

  const output = preHook?.(child.stdout) ?? child.stdout;

  return JSON.parse(output) as T;
};
