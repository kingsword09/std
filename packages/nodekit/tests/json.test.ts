import { assertEquals } from "jsr:@std/assert";
import { readJson } from "../src/json.ts";

Deno.test("readJson", async (_t) => {
  assertEquals(
    readJson.sync<{ foo: "bar" }>(
      import.meta.resolve("./assets/json.test.json"),
    ),
    {
      foo: "bar",
    },
  );
  assertEquals(readJson.sync(import.meta.resolve("./assets/json.test.jsonc")), {
    foo: "bar",
  });
  assertEquals(
    await readJson.async(import.meta.resolve("./assets/json.test.json")),
    {
      foo: "bar",
    },
  );
  assertEquals(
    await readJson.async(import.meta.resolve("./assets/json.test.jsonc")),
    {
      foo: "bar",
    },
  );
});
