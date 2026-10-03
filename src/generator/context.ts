import type { DependencyManifest, PkgKitConfig, TemplateContext } from "../config/types.js";
import { createPackageManagerAdapter } from "../package-managers/index.js";

/**
 * Builds the Handlebars template context from a normalized PkgKitConfig.
 * This is the single place that translates configuration into template variables.
 */
export function buildTemplateContext(config: PkgKitConfig): TemplateContext {
  const { language, packageManager, testRunner, package: pkg } = config;
  const adapter = createPackageManagerAdapter(packageManager);

  const ext = language === "typescript" ? "ts" : "js";

  return {
    package: pkg,
    language,
    packageManager,
    testRunner,
    isTypeScript: language === "typescript",
    isJavaScript: language === "javascript",
    isVitest: testRunner === "vitest",
    isJest: testRunner === "jest",
    paths: {
      entry: `src/index.${ext}`,
      test: `tests/index.test.${ext}`,
    },
    commands: {
      install: adapter.installCommand(),
      test: adapter.testCommand(),
      testWatch: adapter.runCommand("test:watch"),
      build: adapter.buildCommand(),
      lint: adapter.runCommand("lint"),
      format: adapter.runCommand("format"),
      // "add" in templates is used as: {{commands.add}} {{package.name}}
      // Produce the base "pnpm add" / "npm install" / "yarn add" / "bun add" verb
      add: (() => {
        const sample = adapter.addCommand(["__PKG__"]);
        return sample.replace(" __PKG__", "");
      })(),
    },
    year: new Date().getFullYear(),
  };
}

/**
 * Resolves the dev-dependency list for a given configuration combination.
 * Keeps dependency management in one place rather than scattered through templates.
 */
export function buildDependencyManifest(config: PkgKitConfig): DependencyManifest {
  const { language, testRunner } = config;
  const devDependencies: string[] = [];

  // ── Build tooling ────────────────────────────────────────────────────────
  if (language === "typescript") {
    devDependencies.push("typescript", "tsup", "@types/node");
  } else {
    devDependencies.push("tsup"); // tsup works for JS too
  }

  // ── Test runner ──────────────────────────────────────────────────────────
  if (testRunner === "vitest") {
    devDependencies.push("vitest");
    if (language === "typescript") {
      // vitest has built-in TS support via esbuild — no extra types needed
    }
  } else {
    // Jest
    devDependencies.push("jest");
    if (language === "typescript") {
      devDependencies.push("@types/jest", "ts-jest");
    } else {
      devDependencies.push("@types/jest", "babel-jest", "@babel/core", "@babel/preset-env");
    }
  }

  // ── Linting & formatting ─────────────────────────────────────────────────
  devDependencies.push("oxlint", "prettier");

  return {
    dependencies: [],
    devDependencies,
  };
}
