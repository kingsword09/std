import { assertEquals } from "jsr:@std/assert";

import { transformRecordEntries } from "../src/record.ts"

Deno.test("transformRecordEntries - basic transformation", () => {
  const input = {
    a: 1,
    b: 2,
    c: 3
  };

  const result = transformRecordEntries(input, (_key, value) => value * 2);

  assertEquals(result, {
    a: 2,
    b: 4,
    c: 6
  });
});
