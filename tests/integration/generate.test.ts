import { describe, it, expect } from "vitest";
import { join } from "path";
import { existsSync } from "fs";
import { generateProject } from "../../src/generator/generator.js";
import { MemoryFileWriter } from "../../src/generator/writer.js";
import { HandlebarsRenderer } from "../../src/generator/renderer.js";
import type { PkgKitConfig } from "../../src/config/types.js";

// Skip integration tests if templates aren't on disk (e.g. in CI without build)
const templatesExist = existsSync(join(process.cwd(), "templates"));

function makeConfig(
  language: PkgKitConfig["language"],
  packageManager: PkgKitConfig["packageManager"],
  testRunner: PkgKitConfig["testRunner"],
): PkgKitConfig {
  return {
    targetDirectory: "/tmp/test-output",
    package: {
      name: "test-package",
      version: "1.0.0",
      description: "Integration test package",
      entry: language === "typescript" ? "src/index.ts" : "src/index.js",
      testCommand: `${packageManager} test`,
      keywords: ["test"],
      author: "Tester",
      license: "MIT",
    },
    language,
    packageManager,
    testRunner,
    flat: false,
  };
}

describe.skipIf(!templatesExist)("generateProject (in-memory)", () => {
  it("generates TypeScript + pnpm + vitest successfully", async () => {
    const config = makeConfig("typescript", "pnpm", "vitest");
    const writer = new MemoryFileWriter();
    const renderer = new HandlebarsRenderer();

    const result = await generateProject({ config, writer, renderer });

    expect(result.success).toBe(true);
    expect(result.filesWritten.length).toBeGreaterThan(0);
    expect(result.error).toBeUndefined();
  });

  it("generates JavaScript + npm + jest successfully", async () => {
    const config = makeConfig("javascript", "npm", "jest");
    const writer = new MemoryFileWriter();
    const renderer = new HandlebarsRenderer();

    const result = await generateProject({ config, writer, renderer });

    expect(result.success).toBe(true);
    expect(result.filesWritten.length).toBeGreaterThan(0);
  });

  it("generates package.json containing the package name", async () => {
    const config = makeConfig("typescript", "pnpm", "vitest");
    const writer = new MemoryFileWriter();
    const renderer = new HandlebarsRenderer();

    await generateProject({ config, writer, renderer });

    const pkgJson = writer.files.get("package.json");
    expect(pkgJson).toBeDefined();
    expect(pkgJson).toContain('"test-package"');
    expect(pkgJson).toContain('"1.0.0"');
  });

  it("normalises CRLF output to LF before writing files", async () => {
    const config = makeConfig("typescript", "pnpm", "vitest");
    const writer = new MemoryFileWriter();
    const renderer = {
      async render(_templatePath: string, _context: unknown): Promise<string> {
        return "first line\r\nsecond line\r\n";
      },
    };

    const result = await generateProject({ config, writer, renderer });

    expect(result.success).toBe(true);
    expect(writer.files.get("README.md")).toBe("first line\nsecond line\n");
    expect(writer.files.get("README.md")).not.toContain("\r");
  });

  it("generates README containing the package name", async () => {
    const config = makeConfig("typescript", "yarn", "vitest");
    const writer = new MemoryFileWriter();
    const renderer = new HandlebarsRenderer();

    await generateProject({ config, writer, renderer });

    const readme = writer.files.get("README.md");
    expect(readme).toBeDefined();
    expect(readme).toContain("test-package");
  });

  it("generates TypeScript config for TS projects", async () => {
    const config = makeConfig("typescript", "pnpm", "vitest");
    const writer = new MemoryFileWriter();
    const renderer = new HandlebarsRenderer();

    await generateProject({ config, writer, renderer });

    expect(writer.files.has("tsconfig.json")).toBe(true);
    expect(writer.files.has("jsconfig.json")).toBe(false);
  });

  it("generates jsconfig.json for JS projects, not tsconfig.json", async () => {
    const config = makeConfig("javascript", "npm", "vitest");
    const writer = new MemoryFileWriter();
    const renderer = new HandlebarsRenderer();

    await generateProject({ config, writer, renderer });

    expect(writer.files.has("jsconfig.json")).toBe(true);
    expect(writer.files.has("tsconfig.json")).toBe(false);
  });

  it("generates vitest config for vitest runner", async () => {
    const config = makeConfig("typescript", "pnpm", "vitest");
    const writer = new MemoryFileWriter();
    const renderer = new HandlebarsRenderer();

    await generateProject({ config, writer, renderer });

    expect(writer.files.has("vitest.config.ts")).toBe(true);
    expect(writer.files.has("jest.config.ts")).toBe(false);
  });

  it("generates jest config for jest runner", async () => {
    const config = makeConfig("typescript", "pnpm", "jest");
    const writer = new MemoryFileWriter();
    const renderer = new HandlebarsRenderer();

    await generateProject({ config, writer, renderer });

    expect(writer.files.has("jest.config.ts")).toBe(true);
    expect(writer.files.has("vitest.config.ts")).toBe(false);
  });

  it("generates CI workflow", async () => {
    const config = makeConfig("typescript", "pnpm", "vitest");
    const writer = new MemoryFileWriter();
    const renderer = new HandlebarsRenderer();

    await generateProject({ config, writer, renderer });

    const ci = writer.files.get(".github/workflows/ci.yml");
    expect(ci).toBeDefined();
    expect(ci).toContain("pnpm");
  });

  it("generates LICENSE file", async () => {
    const config = makeConfig("typescript", "pnpm", "vitest");
    const writer = new MemoryFileWriter();
    const renderer = new HandlebarsRenderer();

    await generateProject({ config, writer, renderer });

    const license = writer.files.get("LICENSE");
    expect(license).toBeDefined();
    expect(license).toContain("MIT");
  });
});

// ─── 16-combination matrix ───────────────────────────────────────────────────

type Row = {
  language: PkgKitConfig["language"];
  packageManager: PkgKitConfig["packageManager"];
  testRunner: PkgKitConfig["testRunner"];
};

const matrix: Row[] = [
  { language: "typescript", packageManager: "pnpm", testRunner: "vitest" },
  { language: "typescript", packageManager: "npm", testRunner: "vitest" },
  { language: "typescript", packageManager: "yarn", testRunner: "vitest" },
  { language: "typescript", packageManager: "bun", testRunner: "vitest" },
  { language: "typescript", packageManager: "pnpm", testRunner: "jest" },
  { language: "typescript", packageManager: "npm", testRunner: "jest" },
  { language: "typescript", packageManager: "yarn", testRunner: "jest" },
  { language: "typescript", packageManager: "bun", testRunner: "jest" },
  { language: "javascript", packageManager: "pnpm", testRunner: "vitest" },
  { language: "javascript", packageManager: "npm", testRunner: "vitest" },
  { language: "javascript", packageManager: "yarn", testRunner: "vitest" },
  { language: "javascript", packageManager: "bun", testRunner: "vitest" },
  { language: "javascript", packageManager: "pnpm", testRunner: "jest" },
  { language: "javascript", packageManager: "npm", testRunner: "jest" },
  { language: "javascript", packageManager: "yarn", testRunner: "jest" },
  { language: "javascript", packageManager: "bun", testRunner: "jest" },
];

describe.skipIf(!templatesExist)("16-combination generation matrix", () => {
  it.each(matrix)(
    "$language + $packageManager + $testRunner generates successfully",
    async ({ language, packageManager, testRunner }) => {
      const config = makeConfig(language, packageManager, testRunner);
      const writer = new MemoryFileWriter();
      const renderer = new HandlebarsRenderer();

      const result = await generateProject({ config, writer, renderer });

      expect(result.success).toBe(true);
      expect(result.filesWritten.length).toBeGreaterThan(0);

      // Every combination must produce these key files
      expect(writer.files.has("package.json")).toBe(true);
      expect(writer.files.has("src/index." + (language === "typescript" ? "ts" : "js"))).toBe(true);
      expect(writer.files.has("README.md")).toBe(true);
      expect(writer.files.has("LICENSE")).toBe(true);

      // Verify package.json contains correct name
      const pkgJson = writer.files.get("package.json")!;
      expect(pkgJson).toContain('"test-package"');

      // Verify correct test config is generated
      if (language === "typescript") {
        if (testRunner === "vitest") {
          expect(writer.files.has("vitest.config.ts")).toBe(true);
        } else {
          expect(writer.files.has("jest.config.ts")).toBe(true);
        }
      } else {
        if (testRunner === "vitest") {
          expect(writer.files.has("vitest.config.js")).toBe(true);
        } else {
          expect(writer.files.has("jest.config.js")).toBe(true);
        }
      }
    },
  );
});
