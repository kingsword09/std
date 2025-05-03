import { readJson, writeJson } from "@kingsword09/nodekit/json";
import { normalizePath } from "@kingsword09/nodekit/path";
import node_fs from "node:fs/promises";
import node_path from "node:path";
import { build } from "tsdown";
import { loadConfig } from "unconfig";
import "typescript";

interface DenoJson {
  name: string;
  version: string;
  description: string;
  exports: Record<string, string>;
  imports?: Record<string, string>;
  patch?: string[];
  author?: string;
  repository?: { "type": string; "url": string; };
  homepage?: string;
  license?: string;
}

interface PackageJsonExports {
  [key: string]:
    | { import: { types: string; default: string; }; require: { types: string; default: string; }; }
    | string;
}

interface PackageJson {
  name: string;
  version: string;
  description: string;
  main: string;
  module: string;
  types: string;
  exports: PackageJsonExports;
  license?: string;
  author?: string;
  repository?: { "type": string; "url": string; };
  homepage?: string;
  dependencies?: Record<string, string>;
  engines: { node?: string; pnpm: string; };
}

const packageJsonGet = async (denoJson: DenoJson, packageJsonExports: PackageJsonExports) => {
  const dependencies: Record<string, string> = {};
  Object.entries(denoJson.imports ?? {}).forEach((dep) => {
    const value = dep[1];
    if (value.startsWith("jsr:")) {
      dependencies[dep[0]] = `jsr:${value.split("@")[2]}`;
    } else if (value.startsWith("npm:")) {
      dependencies[dep[0]] = `${value.split("@")[1]}`;
    }
  });

  const packageJson = await loadConfig.async<PackageJson>({
    cwd: Deno.cwd(),
    sources: [{
      files: ["deno"],
      extensions: ["json", "jsonc"],
      parser: async (filePath) => {
        const denoConfig = await readJson.async<DenoJson>(filePath);
        const pkgFields: (keyof PackageJson)[] = ["license", "author", "repository", "homepage"];
        const filteredConfig = Object.fromEntries(
          Object.entries(denoConfig).filter(([key]) => pkgFields.includes(key as keyof PackageJson)),
        );
        return {
          name: denoJson.name,
          version: denoJson.version,
          description: denoJson.description,
          dependencies,
          ...filteredConfig,
          main: "./cjs/mod.js",
          module: "./esm/mod.mjs",
          types: "./cjs/mod.d.ts",
          exports: packageJsonExports,
          engines: { pnpm: ">=10.9.0" },
        } satisfies PackageJson;
      },
    }],
  });

  return { packageJson: packageJson.config, workspacePath: node_path.dirname(packageJson.sources[0]) };
};

const packageJsonGen = async (packageJson: PackageJson, outputDir: string) => {
  await writeJson.async(node_path.join(outputDir, "package.json"), JSON.stringify(packageJson, undefined, 2));
  await writeJson.async(
    node_path.join(outputDir, "esm/package.json"),
    JSON.stringify({ "type": "module" }, undefined, 2),
  );
  await writeJson.async(
    node_path.join(outputDir, "cjs/package.json"),
    JSON.stringify({ "type": "commonjs" }, undefined, 2),
  );
};

const copyPublicDir = async (rootPath: string, outputDir: string) => {
  await node_fs.cp(node_path.join(rootPath, "LICENSE_APACHE-2.0"), node_path.join(outputDir, "LICENSE_APACHE-2.0"));
  await node_fs.cp(node_path.join(rootPath, "LICENSE-MIT"), node_path.join(outputDir, "LICENSE-MIT"));
  await node_fs.cp(node_path.resolve(outputDir, "../README.md"), node_path.join(outputDir, "README.md"));
};

/**
 * Build the package for npm
 *
 * @example
 * ```ts
 * import process from "node:process";
 *
 * await npmBuild(process.cwd());
 * ```
 *
 * @param cwd - the root path of the package
 */
export const npmBuild = async (cwd: string) => {
  const denoJson = await readJson.async<DenoJson>(node_path.join(normalizePath(cwd), "./deno.json"));
  const outputDir = node_path.join(normalizePath(cwd), "dist");

  const packageJsonExports: PackageJsonExports = {};
  const entries: Record<string, string> = {};
  Object.entries(denoJson.exports).forEach((entry) => {
    let key = entry[0];

    if (key === ".") {
      key = "mod";
    }
    const modPath = `${key.replace("./", "")}`;
    packageJsonExports[entry[0]] = {
      import: { types: `./esm/${modPath}.d.mts`, default: `./esm/${modPath}.mjs` },
      require: { types: `./cjs/${modPath}.d.ts`, default: `./cjs/${modPath}.js` },
    };

    entries[key] = node_path.join(normalizePath(cwd), entry[1]);
  });

  // 添加 package.json 导出
  packageJsonExports["./package.json"] = "./package.json";
  const { packageJson, workspacePath } = await packageJsonGet(denoJson, packageJsonExports);

  await build({
    entry: entries,
    platform: "node",
    format: ["cjs", "esm"],
    dts: { compilerOptions: { isolatedDeclarations: true }, tsconfig: false },
    clean: true,
    skipNodeModulesBundle: true,
    external: Object.keys(denoJson.imports ?? {}),
    outputOptions: (options, format) => {
      if (format === "es") {
        options.dir = node_path.join(outputDir, "esm");
      } else if (format === "cjs") {
        options.dir = node_path.join(outputDir, "cjs");
      }

      return options;
    },
    hooks: {
      "build:before": (ctx) => {
        ctx.pkg = packageJson;
      },
      "build:done": async () => {
        await packageJsonGen(packageJson, outputDir);
        await copyPublicDir(workspacePath, outputDir);
      },
    },
  });
};
