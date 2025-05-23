import { type Environment, which as whichAsync, whichSync } from "@david/which";
import { quansync, type QuansyncFn } from "quansync";

/**
 * Finds the path to the specified command, supporting both synchronous and asynchronous usage.
 * Returns the absolute path to the executable if found, otherwise returns undefined.
 * This function is a "quansync" wrapper, so you can use it in both sync and async contexts.
 *
 * @example
 * ```ts
 * import { which } from "jsr:@kingsword/nodekit/which";
 *
 * // Sync
 * const commandPath = which.sync("deno");
 * console.log(commandPath); // "/path/to/deno"
 *
 * // Async
 * const commandPath = await which.async("deno");
 * console.log(commandPath); // "/path/to/deno"
 * ```
 *
 * @param command - The name of the command to search for in the system PATH.
 * @returns The absolute path to the command if found, otherwise undefined.
 * @module
 */
const which: QuansyncFn<string | undefined, [command: string]> = quansync({
  sync: (command: string) => whichSync(command),
  async: (command: string) => whichAsync(command),
});

export { type Environment, which, whichAsync, whichSync };
