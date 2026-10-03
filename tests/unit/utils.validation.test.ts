import { describe, it, expect } from "vitest";
import {
  validatePackageNameInput,
  validateVersionInput,
  requireNonEmpty,
} from "../../src/utils/validation.js";

describe("validatePackageNameInput", () => {
  it("returns undefined for valid name", () => {
    expect(validatePackageNameInput("my-package")).toBeUndefined();
  });

  it("returns error string for invalid name", () => {
    expect(validatePackageNameInput("My Package")).toBeTypeOf("string");
  });
});

describe("validateVersionInput", () => {
  it("returns undefined for valid semver", () => {
    expect(validateVersionInput("1.0.0")).toBeUndefined();
  });

  it("returns undefined for empty string (uses default)", () => {
    expect(validateVersionInput("")).toBeUndefined();
  });

  it("returns error for non-semver", () => {
    expect(validateVersionInput("v1.0")).toBeTypeOf("string");
  });
});

describe("requireNonEmpty", () => {
  const validator = requireNonEmpty("Name");

  it("returns undefined for non-empty string", () => {
    expect(validator("hello")).toBeUndefined();
  });

  it("returns error for empty string", () => {
    expect(validator("")).toBeTypeOf("string");
  });

  it("returns error for whitespace-only string", () => {
    expect(validator("   ")).toBeTypeOf("string");
  });
});
