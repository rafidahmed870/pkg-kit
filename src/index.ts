/**
 * create-pkg-kit — public programmatic API
 *
 * This module exports everything a consumer might need to use pkg-kit
 * as a library rather than a CLI. The CLI entry point (src/cli/index.ts)
 * is separate and not re-exported here.
 */

// ─── Config ───────────────────────────────────────────────────────────────────
export type {
  Language,
  PackageManager,
  TestRunner,
  PackageMetadata,
  PkgKitConfig,
  TemplateContext,
  DependencyManifest,
} from "./config/types.js";

export {
  derivePackageName,
  buildFlatDefaults,
  PROMPT_DEFAULTS,
  SUPPORTED_LICENSES,
} from "./config/defaults.js";

export {
  validatePackageName,
  validateVersion,
  validateTargetDirectory,
  validateConfig,
} from "./config/schema.js";

// ─── Package managers ─────────────────────────────────────────────────────────
export type { PackageManagerAdapter } from "./package-managers/types.js";
export { createPackageManagerAdapter, PACKAGE_MANAGER_CHOICES } from "./package-managers/index.js";
export { PnpmAdapter } from "./package-managers/pnpm.js";
export { NpmAdapter } from "./package-managers/npm.js";
export { YarnAdapter } from "./package-managers/yarn.js";
export { BunAdapter } from "./package-managers/bun.js";

// ─── Generator ────────────────────────────────────────────────────────────────
export { generateProject } from "./generator/generator.js";
export type { GenerateProjectOptions, GenerateProjectResult } from "./generator/generator.js";
export { buildTemplateContext, buildDependencyManifest } from "./generator/context.js";
export { resolveTemplates } from "./generator/resolver.js";
export type { TemplateFile } from "./generator/resolver.js";
export { HandlebarsRenderer } from "./generator/renderer.js";
export type { TemplateRenderer } from "./generator/renderer.js";
export { DiskFileWriter, MemoryFileWriter } from "./generator/writer.js";
export type { FileWriter } from "./generator/writer.js";

// ─── Utils ────────────────────────────────────────────────────────────────────
export { logger } from "./utils/logger.js";
export { resolveTargetDirectory, getTemplatesRoot, getPackageRoot } from "./utils/paths.js";
export {
  pathExists,
  isEmptyDirectory,
  isNonEmptyDirectory,
  hasPackageJson,
  ensureDir,
  writeFileSafe,
  readFileSafe,
} from "./utils/fs.js";

// ─── Version ──────────────────────────────────────────────────────────────────
export { version } from "./version.js";
