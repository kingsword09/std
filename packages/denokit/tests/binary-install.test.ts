import { assertEquals } from "jsr:@std/assert";
import { Binary } from "../src/binary-install.ts";

Deno.test("binary-install", async (t) => {
  const tempDirPath = await Deno.makeTempDir({ prefix: "denokit_binary_install_" });
  const binaryName = "wasm-pack";
  const binaryVersion = "v0.13.1";
  const binary = new Binary(
    binaryName,
    "https://github.com/rustwasm/wasm-pack/releases/download/v0.13.1/wasm-pack-v0.13.1-x86_64-apple-darwin.tar.gz",
    binaryVersion,
    { installDirectory: tempDirPath },
  );

  await t.step("install", async () => {
    await binary.install();
  });

  await t.step("exists", () => {
    assertEquals(binary.exists(), true);
  });

  await t.step("after", async () => {
    await Deno.remove(tempDirPath, { recursive: true });
  });
});
