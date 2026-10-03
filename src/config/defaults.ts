import type { Language, PackageManager, PackageMetadata } from "./types.js";

/**
 * Derive a safe npm package name from a directory path segment.
 * Falls back to empty string so the caller can decide to prompt.
 */
export function derivePackageName(targetDirectory: string): string {
  const segment = targetDirectory.replace(/\\/g, "/").split("/").filter(Boolean).pop();

  if (!segment || segment === ".") return "";

  // Lowercase, replace spaces/underscores with hyphens, strip illegal chars
  const name = segment
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9\-@./]/g, "")
    .replace(/^-+|-+$/g, "");

  return name;
}

/**
 * Build flat-mode defaults for package metadata.
 * Required fields (name) are provided separately by the caller.
 */
export function buildFlatDefaults(
  name: string,
  language: Language,
  packageManager: PackageManager,
): PackageMetadata {
  const ext = language === "typescript" ? "ts" : "js";
  const testCmd = packageManager === "npm" ? "npm test" : `${packageManager} test`;

  return {
    name,
    version: "1.0.0",
    description: "",
    entry: `src/index.${ext}`,
    testCommand: testCmd,
    repository: undefined,
    keywords: [],
    author: undefined,
    license: "MIT",
  };
}

/**
 * Sensible interactive-mode defaults shown as placeholder values in prompts.
 */
export const PROMPT_DEFAULTS = {
  version: "1.0.0",
  license: "MIT",
  entry: {
    typescript: "src/index.ts",
    javascript: "src/index.js",
  },
} as const;

/** Ordered list of supported licenses for validation */
export const SUPPORTED_LICENSES = [
  "MIT",
  "ISC",
  "Apache-2.0",
  "GPL-2.0",
  "GPL-3.0",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "MPL-2.0",
  "UNLICENSED",
] as const;

export type SupportedLicense = (typeof SUPPORTED_LICENSES)[number];
