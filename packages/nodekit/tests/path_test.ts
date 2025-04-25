import { assertEquals } from "jsr:@std/assert";
import { normalizePath } from "../path.ts";

Deno.test(
  "normalizePath non windows",
  { ignore: Deno.build.os === "windows" },
  (_t) => {
    assertEquals(normalizePath("file:///home/user"), "/home/user");
    assertEquals(normalizePath("/home/user"), "/home/user");
    assertEquals(
      normalizePath("file:///home/user/test.json"),
      "/home/user/test.json",
    );
  },
);

Deno.test(
  "normalizePath windows",
  { ignore: Deno.build.os !== "windows" },
  (_t) => {
    assertEquals(
      normalizePath("C:\\temp\\\\foo\\bar\\..\\"),
      "C:\\temp\\foo\\",
    );
    assertEquals(
      normalizePath("file:\\C:\\temp\\\\foo\\bar\\..\\"),
      "C:\\temp\\foo\\",
    );
  },
);
