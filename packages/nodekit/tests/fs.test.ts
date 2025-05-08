import { assertEquals, assertExists } from "jsr:@std/assert";
import { exists, readFile, writeFileSimple } from "../src/fs.ts";

Deno.test("readFile", async (_t) => {
  let content = readFile.sync(import.meta.resolve("./fs.test.ts"));
  assertExists(content);
  content = await readFile.async(import.meta.resolve("./fs.test.ts"));
  assertExists(content);
});

Deno.test("exists", async (_t) => {
  let isExists = exists.sync(import.meta.resolve("./fs.test.ts"));
  assertEquals(isExists, true);
  isExists = await exists.async(import.meta.resolve("./fs.test.ts"));
  assertEquals(isExists, true);
});

Deno.test("writeFileSimple", async (_t) => {
  writeFileSimple;
  // writeFileSimple.sync("./test.txt", "Hello World", {mkdirIfNotExists: true});
  // await writeFileSimple.async("./test.txt", "Hello World", {mkdirIfNotExists: true})
});
