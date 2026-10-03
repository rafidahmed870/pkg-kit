import { describe, it, expect } from "vitest";
import { join } from "path";
import { normalisePath } from "../../src/generator/resolver.js";

// NOTE: resolveTemplates() depends on getTemplatesRoot() which points to the
// installed/built templates directory. We test it via integration tests instead.
// Here we focus on helpers that are safe to unit-test in isolation.

describe("normalisePath", () => {
  it("converts backslashes to forward slashes", () => {
    expect(normalisePath("src\\index.ts")).toBe("src/index.ts");
  });

  it("leaves forward slashes unchanged", () => {
    expect(normalisePath("src/index.ts")).toBe("src/index.ts");
  });

  it("handles nested paths", () => {
    expect(normalisePath("tests\\unit\\foo.test.ts")).toBe("tests/unit/foo.test.ts");
  });
});

describe("resolveTemplates path shape", () => {
  // We can import and test this IF templates exist on disk during test run.
  // Tests run from the repo root, so templates/ is present.

  it("is testable — templates directory exists", async () => {
    const { existsSync } = await import("fs");
    const templatesRoot = join(process.cwd(), "templates");
    expect(existsSync(templatesRoot)).toBe(true);
  });
});
