/**
 * Input-level validation helpers used by prompts.
 * These return string error messages (for @clack/prompts validators)
 * or undefined when the value is valid.
 */

import { validatePackageName, validateVersion } from "../config/schema.js";

export function validatePackageNameInput(value: string): string | undefined {
  const result = validatePackageName(value);
  return result.valid ? undefined : result.error;
}

export function validateVersionInput(value: string): string | undefined {
  if (!value || value.trim() === "") return undefined; // empty = use default
  const result = validateVersion(value);
  return result.valid ? undefined : result.error;
}

/**
 * Ensures a string is not blank.
 */
export function requireNonEmpty(label: string) {
  return (value: string): string | undefined => {
    if (!value || value.trim() === "") {
      return `${label} cannot be empty.`;
    }
    return undefined;
  };
}

/**
 * Allows a value to be empty (optional field) — always passes.
 */
export function allowEmpty(_value: string): undefined {
  return undefined;
}
