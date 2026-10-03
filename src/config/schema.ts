import type { Language, PackageManager, PkgKitConfig, TestRunner } from "./types.js";

// ─── Validation result ────────────────────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// ─── npm package name ─────────────────────────────────────────────────────────

/**
 * Validates an npm package name according to npm naming rules.
 * Supports scoped packages (@scope/name).
 */
export function validatePackageName(name: string): ValidationResult {
  if (!name || name.trim().length === 0) {
    return { valid: false, error: "Package name cannot be empty." };
  }

  const trimmed = name.trim();

  if (trimmed.length > 214) {
    return { valid: false, error: "Package name must be 214 characters or fewer." };
  }

  if (trimmed.startsWith(".") || trimmed.startsWith("_")) {
    return { valid: false, error: "Package name cannot start with a dot or underscore." };
  }

  if (trimmed !== trimmed.toLowerCase()) {
    return { valid: false, error: "Package name must be lowercase." };
  }

  // Scoped package: @scope/name
  if (trimmed.startsWith("@")) {
    const scopedPattern = /^@[a-z0-9\-._]+\/[a-z0-9\-._]+$/;
    if (!scopedPattern.test(trimmed)) {
      return {
        valid: false,
        error: 'Scoped package name must match @scope/name (e.g. "@myorg/my-pkg").',
      };
    }
    return { valid: true };
  }

  // Unscoped package
  const unscopedPattern = /^[a-z0-9\-._]+$/;
  if (!unscopedPattern.test(trimmed)) {
    return {
      valid: false,
      error:
        "Package name may only contain lowercase letters, numbers, hyphens, dots, and underscores.",
    };
  }

  return { valid: true };
}

// ─── Semver version ───────────────────────────────────────────────────────────

export function validateVersion(version: string): ValidationResult {
  if (!version || version.trim().length === 0) {
    return { valid: false, error: "Version cannot be empty." };
  }

  const semverPattern = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;
  if (!semverPattern.test(version.trim())) {
    return {
      valid: false,
      error: 'Version must follow semantic versioning (e.g. "1.0.0" or "1.0.0-beta.1").',
    };
  }

  return { valid: true };
}

// ─── Target directory / path traversal guard ─────────────────────────────────

export function validateTargetDirectory(dir: string): ValidationResult {
  if (!dir || dir.trim().length === 0) {
    return { valid: false, error: "Target directory cannot be empty." };
  }

  // Path traversal guard: reject anything resolving above CWD
  const normalized = dir.replace(/\\/g, "/");
  if (normalized.includes("..")) {
    return {
      valid: false,
      error: 'Target directory must not contain ".." (path traversal not allowed).',
    };
  }

  // Reject absolute paths outside of safe zones
  if (/^(\/etc|\/usr|\/bin|\/sbin|C:\\Windows|C:\\System)/i.test(normalized)) {
    return { valid: false, error: "Target directory points to a restricted system path." };
  }

  return { valid: true };
}

// ─── Enum guards ──────────────────────────────────────────────────────────────

const VALID_LANGUAGES: Language[] = ["typescript", "javascript"];
const VALID_PACKAGE_MANAGERS: PackageManager[] = ["pnpm", "npm", "yarn", "bun"];
const VALID_TEST_RUNNERS: TestRunner[] = ["vitest", "jest"];

export function validateLanguage(value: unknown): ValidationResult {
  if (!VALID_LANGUAGES.includes(value as Language)) {
    return {
      valid: false,
      error: `Language must be one of: ${VALID_LANGUAGES.join(", ")}.`,
    };
  }
  return { valid: true };
}

export function validatePackageManager(value: unknown): ValidationResult {
  if (!VALID_PACKAGE_MANAGERS.includes(value as PackageManager)) {
    return {
      valid: false,
      error: `Package manager must be one of: ${VALID_PACKAGE_MANAGERS.join(", ")}.`,
    };
  }
  return { valid: true };
}

export function validateTestRunner(value: unknown): ValidationResult {
  if (!VALID_TEST_RUNNERS.includes(value as TestRunner)) {
    return {
      valid: false,
      error: `Test runner must be one of: ${VALID_TEST_RUNNERS.join(", ")}.`,
    };
  }
  return { valid: true };
}

// ─── Full config validation ───────────────────────────────────────────────────

export interface ConfigValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateConfig(config: PkgKitConfig): ConfigValidationResult {
  const errors: string[] = [];

  const nameResult = validatePackageName(config.package.name);
  if (!nameResult.valid && nameResult.error) errors.push(nameResult.error);

  const versionResult = validateVersion(config.package.version);
  if (!versionResult.valid && versionResult.error) errors.push(versionResult.error);

  const dirResult = validateTargetDirectory(config.targetDirectory);
  if (!dirResult.valid && dirResult.error) errors.push(dirResult.error);

  const langResult = validateLanguage(config.language);
  if (!langResult.valid && langResult.error) errors.push(langResult.error);

  const pmResult = validatePackageManager(config.packageManager);
  if (!pmResult.valid && pmResult.error) errors.push(pmResult.error);

  const trResult = validateTestRunner(config.testRunner);
  if (!trResult.valid && trResult.error) errors.push(trResult.error);

  return { valid: errors.length === 0, errors };
}
