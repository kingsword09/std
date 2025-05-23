import { assertEquals, assertExists } from "jsr:@std/assert";
import * as path from "jsr:@std/path";
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

Deno.test("writeFileSimple", async (t) => {
  const tempDirPath = await Deno.makeTempDir({ prefix: "nodekit_fs_write_" });
  const tempFilePath = path.join(tempDirPath, "test.txt");

  await t.step("write", () => {
    writeFileSimple.sync(tempFilePath, "Hello World");
  });

  await t.step("exists", () => {
    const isExists = exists.sync(tempFilePath);
    assertEquals(isExists, true);
  });

  await t.step("read", async () => {
    const content = await readFile.async(tempFilePath, { encoding: "utf-8" });
    assertEquals(content, "Hello World");
  });

  await t.step("after", async () => {
    await Deno.remove(tempDirPath, { recursive: true });
  });
});
