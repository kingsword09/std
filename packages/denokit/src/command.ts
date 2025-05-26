import { which } from "./which.ts";

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
  options: Partial<Pick<Deno.CommandOptions, "args" | "cwd">>,
): Promise<T> => {
  const cmd = new Deno.Command(await which.async(command) ?? command, {
    args: options.args ?? [],
    stdin: "inherit",
    cwd: options.cwd ?? Deno.cwd(),
  });

  const output = await cmd.output();
  if (!output.success) {
    throw new Error("Command failed with code " + output.code);
  }

  return JSON.parse(new TextDecoder().decode(output.stdout)) as T;
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
export const commandOutputWithJsonParserSync = <T extends unknown>(
  command: string,
  options: Partial<Pick<Deno.CommandOptions, "args" | "cwd">>,
): T => {
  const cmd = new Deno.Command(which.sync(command) ?? command, {
    args: options.args ?? [],
    stdin: "inherit",
    cwd: options.cwd ?? Deno.cwd(),
  });

  const output = cmd.outputSync();
  if (!output.success) {
    throw new Error("Command failed with code " + output.code);
  }

  return JSON.parse(new TextDecoder().decode(output.stdout)) as T;
};
