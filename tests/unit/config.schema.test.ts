import { describe, it, expect } from "vitest";
import {
  validatePackageName,
  validateVersion,
  validateTargetDirectory,
  validateLanguage,
  validatePackageManager,
  validateTestRunner,
  validateConfig,
} from "../../src/config/schema.js";
import type { PkgKitConfig } from "../../src/config/types.js";

// ─── validatePackageName ──────────────────────────────────────────────────────

describe("validatePackageName", () => {
  it("accepts a simple lowercase name", () => {
    expect(validatePackageName("my-package").valid).toBe(true);
  });

  it("accepts a scoped package", () => {
    expect(validatePackageName("@myorg/my-pkg").valid).toBe(true);
  });

  it("accepts names with dots and underscores", () => {
    expect(validatePackageName("my.pkg_v2").valid).toBe(true);
  });

  it("rejects empty string", () => {
    const r = validatePackageName("");
    expect(r.valid).toBe(false);
    expect(r.error).toBeDefined();
  });

  it("rejects uppercase letters", () => {
    const r = validatePackageName("MyPackage");
    expect(r.valid).toBe(false);
  });

  it("rejects names starting with a dot", () => {
    expect(validatePackageName(".hidden").valid).toBe(false);
  });

  it("rejects names starting with underscore", () => {
    expect(validatePackageName("_internal").valid).toBe(false);
  });

  it("rejects names over 214 chars", () => {
    expect(validatePackageName("a".repeat(215)).valid).toBe(false);
  });

  it("rejects names with spaces", () => {
    expect(validatePackageName("my package").valid).toBe(false);
  });

  it("rejects malformed scoped names", () => {
    expect(validatePackageName("@/missing-scope").valid).toBe(false);
  });
});

// ─── validateVersion ─────────────────────────────────────────────────────────

describe("validateVersion", () => {
  it("accepts 1.0.0", () => {
    expect(validateVersion("1.0.0").valid).toBe(true);
  });

  it("accepts pre-release: 1.0.0-beta.1", () => {
    expect(validateVersion("1.0.0-beta.1").valid).toBe(true);
  });

  it("accepts build metadata: 1.0.0+build.123", () => {
    expect(validateVersion("1.0.0+build.123").valid).toBe(true);
  });

  it("rejects empty string", () => {
    expect(validateVersion("").valid).toBe(false);
  });

  it("rejects non-semver: v1.0.0", () => {
    expect(validateVersion("v1.0.0").valid).toBe(false);
  });

  it("rejects non-semver: 1.0", () => {
    expect(validateVersion("1.0").valid).toBe(false);
  });

  it("rejects plain text", () => {
    expect(validateVersion("latest").valid).toBe(false);
  });
});

// ─── validateTargetDirectory ──────────────────────────────────────────────────

describe("validateTargetDirectory", () => {
  it("accepts a simple directory name", () => {
    expect(validateTargetDirectory("my-package").valid).toBe(true);
  });

  it("accepts dot (current dir)", () => {
    expect(validateTargetDirectory(".").valid).toBe(true);
  });

  it("rejects path traversal", () => {
    const r = validateTargetDirectory("../../etc/passwd");
    expect(r.valid).toBe(false);
    expect(r.error).toContain("..");
  });

  it("rejects empty string", () => {
    expect(validateTargetDirectory("").valid).toBe(false);
  });
});

// ─── enum validators ─────────────────────────────────────────────────────────

describe("validateLanguage", () => {
  it("accepts typescript", () => expect(validateLanguage("typescript").valid).toBe(true));
  it("accepts javascript", () => expect(validateLanguage("javascript").valid).toBe(true));
  it("rejects unknown", () => expect(validateLanguage("python").valid).toBe(false));
});

describe("validatePackageManager", () => {
  it("accepts pnpm", () => expect(validatePackageManager("pnpm").valid).toBe(true));
  it("accepts npm", () => expect(validatePackageManager("npm").valid).toBe(true));
  it("accepts yarn", () => expect(validatePackageManager("yarn").valid).toBe(true));
  it("accepts bun", () => expect(validatePackageManager("bun").valid).toBe(true));
  it("rejects unknown", () => expect(validatePackageManager("deno").valid).toBe(false));
});

describe("validateTestRunner", () => {
  it("accepts vitest", () => expect(validateTestRunner("vitest").valid).toBe(true));
  it("accepts jest", () => expect(validateTestRunner("jest").valid).toBe(true));
  it("rejects unknown", () => expect(validateTestRunner("mocha").valid).toBe(false));
});

// ─── validateConfig ───────────────────────────────────────────────────────────

describe("validateConfig", () => {
  const base: PkgKitConfig = {
    targetDirectory: "my-pkg",
    package: {
      name: "my-pkg",
      version: "1.0.0",
      description: "",
      entry: "src/index.ts",
      testCommand: "pnpm test",
      keywords: [],
      license: "MIT",
    },
    language: "typescript",
    packageManager: "pnpm",
    testRunner: "vitest",
    flat: false,
  };

  it("passes a valid config", () => {
    expect(validateConfig(base).valid).toBe(true);
    expect(validateConfig(base).errors).toHaveLength(0);
  });

  it("collects multiple errors", () => {
    const bad: PkgKitConfig = {
      ...base,
      package: { ...base.package, name: "Bad Name", version: "nope" },
    };
    const r = validateConfig(bad);
    expect(r.valid).toBe(false);
    expect(r.errors.length).toBeGreaterThanOrEqual(2);
  });
});
