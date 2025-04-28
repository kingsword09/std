import { assertEquals, assertExists } from "jsr:@std/assert";
import { exists, readFile, readFileString } from "../src/fs.ts";

Deno.test("readFile", async (_t) => {
  let content = readFile.sync(import.meta.resolve("./fs.test.ts"));
  assertExists(content);
  content = await readFile.async(import.meta.resolve("./fs.test.ts"));
  assertExists(content);
});

Deno.test("readFileString", async (_t) => {
  let content = readFileString.sync(import.meta.resolve("./fs.test.ts"));
  assertEquals(typeof content, "string");
  content = await readFileString.async(import.meta.resolve("./fs.test.ts"));
  assertEquals(typeof content, "string");
});

Deno.test("exists", async (_t) => {
  let isExists = exists.sync(import.meta.resolve("./fs.test.ts"));
  assertEquals(isExists, true);
  isExists = await exists.async(import.meta.resolve("./fs.test.ts"));
  assertEquals(isExists, true);
});
