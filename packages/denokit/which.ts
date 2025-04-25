import { quansync } from "npm:quansync";
import {
  which as whichAsync,
  whichSync,
  type Environment,
} from "jsr:@david/which";

/**
 * Finds the path to the specified command, supporting both synchronous and asynchronous usage.
 * Returns the absolute path to the executable if found, otherwise returns undefined.
 * This function is a "quansync" wrapper, so you can use it in both sync and async contexts.
 *
 * @param command - The name of the command to search for in the system PATH.
 * @returns The absolute path to the command if found, otherwise undefined.
 */
const which = quansync({
  sync: (command: string) => whichSync(command),
  async: (command: string) => whichAsync(command),
});

export { which, whichAsync, whichSync, type Environment };
