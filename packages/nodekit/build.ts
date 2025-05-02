import { npmBuild } from "../../scripts/build.ts";

if (import.meta.main) {
  npmBuild(import.meta.resolve("./"));
}
