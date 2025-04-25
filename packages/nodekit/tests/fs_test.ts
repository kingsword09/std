import { assertEquals, assertExists } from "jsr:@std/assert";
import { exists, readFile } from "../fs.ts";

Deno.test("readFile", async (_t) => {
  let content = readFile.sync("./fs_test.ts");
  assertExists(content);
  content = await readFile.async("./fs_test.ts");
  assertExists(content);
});

Deno.test("exists", async (_t) => {
  let isExists = exists.sync("./fs_test.ts");
  assertEquals(isExists, true);
  isExists = await exists.async("./fs_test.ts");
  assertEquals(isExists, true);
});
