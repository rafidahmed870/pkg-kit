import { describe, it, expect } from "vitest";
import { resolve } from "path";
import { resolveTargetDirectory, stripTrailingSlash, safejoin } from "../../src/utils/paths.js";

describe("resolveTargetDirectory", () => {
  it("returns CWD for empty string", () => {
    expect(resolveTargetDirectory("")).toBe(process.cwd());
  });

  it("returns CWD for dot", () => {
    expect(resolveTargetDirectory(".")).toBe(process.cwd());
  });

  it("resolves a relative path against CWD", () => {
    const expected = resolve(process.cwd(), "my-package");
    expect(resolveTargetDirectory("my-package")).toBe(expected);
  });

  it("returns absolute paths unchanged", () => {
    const abs = process.platform === "win32" ? "C:\\some\\path" : "/some/path";
    expect(resolveTargetDirectory(abs)).toBe(abs);
  });
});

describe("stripTrailingSlash", () => {
  it("removes trailing forward slash", () => {
    expect(stripTrailingSlash("/foo/bar/")).toBe("/foo/bar");
  });

  it("removes trailing backslash", () => {
    expect(stripTrailingSlash("C:\\foo\\bar\\")).toBe("C:\\foo\\bar");
  });

  it("leaves paths without trailing slash unchanged", () => {
    expect(stripTrailingSlash("/foo/bar")).toBe("/foo/bar");
  });
});

describe("safejoin", () => {
  it("joins path segments", () => {
    const result = safejoin("a", "b", "c");
    expect(result.includes("a")).toBe(true);
    expect(result.includes("c")).toBe(true);
  });
});
