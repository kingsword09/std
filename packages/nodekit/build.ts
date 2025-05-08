import { build } from "jsr:@kingsword09/dwpkg";

if (import.meta.main) {
  await build({
    denoJsonPath: import.meta.resolve("./deno.json"),
    jsrRegistry: false,
    format: "both",
    platform: "node",
    external: ["@std/jsonc", "quansync"],
    packageJson: {
      author: "Kingsword kingsword09 <kingsword09@gmail.com>",
      repository: { "type": "git", "url": "git+https://github.com/kingsword09/std.git" },
      homepage: "https://github.com/kingsword09/std#readme",
      license: "Apache-2.0 or MIT",
    },
  });
}
