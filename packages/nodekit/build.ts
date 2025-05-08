import { build } from "jsr:@kingsword09/dwpkg";

if (import.meta.main) {
  await build({
    denoJsonPath: import.meta.resolve("./deno.json"),
    jsrRegistry: false,
    format: "both",
    platform: "node",
    external: ["@std/jsonc", "quansync"],
    packageJson: { author: "Kingsword kingsword09 <kingsword09@gmail.com>" },
  });
}
