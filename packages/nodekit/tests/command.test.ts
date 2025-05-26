import { assertEquals } from "jsr:@std/assert";
import { commandOutputWithJsonParserAsync, commandOutputWithJsonParserSync } from "../src/command.ts";

Deno.test("command-async", async (_t) => {
  const res = await commandOutputWithJsonParserAsync("npm", { args: ["view", "dwpkg", "--json"] });

  // @ts-ignore: npm package
  assertEquals(res.name, "dwpkg");
});

Deno.test("command-sync", (_t) => {
  const res = commandOutputWithJsonParserSync("npm", { args: ["view", "dwpkg", "--json"] });

  // @ts-ignore: npm package
  assertEquals(res.name, "dwpkg");
});
