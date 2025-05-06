import { build } from "jsr:@kingsword09/dwpkg";

if (import.meta.main) {
  await build({
    config: import.meta.resolve("./deno.json"),
    jsrRegistry: false,
    format: "both",
    platform: "node",
    external: ["@std/jsonc", "quansync"],
  });
}
