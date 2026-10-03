import { describe, it, expect } from "vitest";
import { derivePackageName, buildFlatDefaults } from "../../src/config/defaults.js";

describe("derivePackageName", () => {
  it("returns the last path segment", () => {
    expect(derivePackageName("/home/user/projects/my-package")).toBe("my-package");
  });

  it("handles Windows-style paths", () => {
    expect(derivePackageName("C:\\Users\\dev\\my-pkg")).toBe("my-pkg");
  });

  it("lowercases the name", () => {
    expect(derivePackageName("/projects/MyPackage")).toBe("mypackage");
  });

  it("converts underscores to hyphens", () => {
    expect(derivePackageName("/projects/my_package")).toBe("my-package");
  });

  it("returns empty string for dot (current dir)", () => {
    expect(derivePackageName(".")).toBe("");
  });

  it("returns empty string for empty input", () => {
    expect(derivePackageName("")).toBe("");
  });
});

describe("buildFlatDefaults", () => {
  it("builds TypeScript defaults", () => {
    const d = buildFlatDefaults("my-pkg", "typescript", "pnpm");
    expect(d.name).toBe("my-pkg");
    expect(d.version).toBe("1.0.0");
    expect(d.entry).toBe("src/index.ts");
    expect(d.testCommand).toBe("pnpm test");
    expect(d.license).toBe("MIT");
    expect(d.description).toBe("");
    expect(d.keywords).toEqual([]);
  });

  it("builds JavaScript defaults", () => {
    const d = buildFlatDefaults("my-pkg", "javascript", "npm");
    expect(d.entry).toBe("src/index.js");
    expect(d.testCommand).toBe("npm test");
  });

  it("uses packageManager test command for non-npm", () => {
    expect(buildFlatDefaults("x", "typescript", "yarn").testCommand).toBe("yarn test");
    expect(buildFlatDefaults("x", "typescript", "bun").testCommand).toBe("bun test");
  });
});
