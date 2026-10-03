import { describe, it, expect } from "vitest";
import { buildTemplateContext, buildDependencyManifest } from "../../src/generator/context.js";
import type { PkgKitConfig } from "../../src/config/types.js";

const baseConfig: PkgKitConfig = {
  targetDirectory: "/tmp/my-pkg",
  package: {
    name: "my-pkg",
    version: "1.0.0",
    description: "A test package",
    entry: "src/index.ts",
    testCommand: "pnpm test",
    keywords: ["util"],
    author: "Test Author",
    license: "MIT",
  },
  language: "typescript",
  packageManager: "pnpm",
  testRunner: "vitest",
  flat: false,
};

describe("buildTemplateContext", () => {
  it("sets language booleans correctly for TypeScript", () => {
    const ctx = buildTemplateContext(baseConfig);
    expect(ctx.isTypeScript).toBe(true);
    expect(ctx.isJavaScript).toBe(false);
  });

  it("sets language booleans correctly for JavaScript", () => {
    const ctx = buildTemplateContext({ ...baseConfig, language: "javascript" });
    expect(ctx.isTypeScript).toBe(false);
    expect(ctx.isJavaScript).toBe(true);
  });

  it("sets testRunner booleans correctly for Vitest", () => {
    const ctx = buildTemplateContext(baseConfig);
    expect(ctx.isVitest).toBe(true);
    expect(ctx.isJest).toBe(false);
  });

  it("sets testRunner booleans correctly for Jest", () => {
    const ctx = buildTemplateContext({ ...baseConfig, testRunner: "jest" });
    expect(ctx.isVitest).toBe(false);
    expect(ctx.isJest).toBe(true);
  });

  it("sets correct paths for TypeScript", () => {
    const ctx = buildTemplateContext(baseConfig);
    expect(ctx.paths.entry).toBe("src/index.ts");
    expect(ctx.paths.test).toBe("tests/index.test.ts");
  });

  it("sets correct paths for JavaScript", () => {
    const ctx = buildTemplateContext({ ...baseConfig, language: "javascript" });
    expect(ctx.paths.entry).toBe("src/index.js");
    expect(ctx.paths.test).toBe("tests/index.test.js");
  });

  it("builds correct pnpm commands", () => {
    const ctx = buildTemplateContext(baseConfig);
    expect(ctx.commands.install).toBe("pnpm install");
    expect(ctx.commands.test).toBe("pnpm test");
    expect(ctx.commands.build).toBe("pnpm build");
  });

  it("builds correct npm commands", () => {
    const ctx = buildTemplateContext({ ...baseConfig, packageManager: "npm" });
    expect(ctx.commands.install).toBe("npm install");
    expect(ctx.commands.test).toBe("npm test");
    expect(ctx.commands.build).toBe("npm run build");
  });

  it("includes package metadata", () => {
    const ctx = buildTemplateContext(baseConfig);
    expect(ctx.package.name).toBe("my-pkg");
    expect(ctx.package.license).toBe("MIT");
  });

  it("sets year to the current year", () => {
    const ctx = buildTemplateContext(baseConfig);
    expect(ctx.year).toBe(new Date().getFullYear());
  });
});

describe("buildDependencyManifest", () => {
  it("includes typescript and tsup for TS", () => {
    const m = buildDependencyManifest(baseConfig);
    expect(m.devDependencies).toContain("typescript");
    expect(m.devDependencies).toContain("tsup");
  });

  it("includes vitest for vitest runner", () => {
    const m = buildDependencyManifest(baseConfig);
    expect(m.devDependencies).toContain("vitest");
    expect(m.devDependencies).not.toContain("jest");
  });

  it("includes jest deps for jest runner + TypeScript", () => {
    const m = buildDependencyManifest({ ...baseConfig, testRunner: "jest" });
    expect(m.devDependencies).toContain("jest");
    expect(m.devDependencies).toContain("ts-jest");
    expect(m.devDependencies).not.toContain("vitest");
  });

  it("includes babel for jest runner + JavaScript", () => {
    const m = buildDependencyManifest({
      ...baseConfig,
      language: "javascript",
      testRunner: "jest",
    });
    expect(m.devDependencies).toContain("babel-jest");
    expect(m.devDependencies).toContain("@babel/core");
  });

  it("includes oxlint and prettier always", () => {
    const m = buildDependencyManifest(baseConfig);
    expect(m.devDependencies).toContain("oxlint");
    expect(m.devDependencies).toContain("prettier");
  });

  it("has no runtime dependencies", () => {
    const m = buildDependencyManifest(baseConfig);
    expect(m.dependencies).toHaveLength(0);
  });
});
