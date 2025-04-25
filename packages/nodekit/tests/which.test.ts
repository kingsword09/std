import { assertEquals } from "jsr:@std/assert";
import { which } from "../src/which.ts";

const expectedCurlLocation = await getLocation("curl");

Deno.test("nodekit which", async (_t) => {
  let curlPath = await which.async("curl");
  assertEquals(curlPath, expectedCurlLocation);

  curlPath = which.sync("curl");
  assertEquals(curlPath, expectedCurlLocation);
});

async function getLocation(command: string) {
  const cmd = Deno.build.os === "windows"
    ? ["cmd", "/c", "where", command]
    : ["which", command];
  const p = await new Deno.Command(cmd[0], {
    args: cmd.slice(1),
    stdout: "piped",
  }).output();
  return new TextDecoder().decode(p.stdout).split(/\r?\n/)[0];
}
