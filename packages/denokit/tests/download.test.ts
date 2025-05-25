import { assertEquals } from "jsr:@std/assert";
import { downloadAndExtractTarGz } from "../src/download.ts";

Deno.test("downloadAndExtractTarGz", async (t) => {
  const destPath = await Deno.makeTempDir({ prefix: "denokit-download-" + Date.now() });
  const actualPath = await downloadAndExtractTarGz({
    url: "https://npm.jsr.io/~/11/@jsr/kingsword__nodekit/0.1.0.tgz",
    destPath,
  });

  assertEquals(actualPath, destPath);

  await t.step("cleanup", async () => {
    await Deno.remove(destPath, { recursive: true });
  });
});
