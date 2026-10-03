import type { PackageManager } from "../config/types.js";
import { BunAdapter } from "./bun.js";
import { NpmAdapter } from "./npm.js";
import { PnpmAdapter } from "./pnpm.js";
import type { PackageManagerAdapter } from "./types.js";
import { YarnAdapter } from "./yarn.js";

export type { PackageManagerAdapter } from "./types.js";
export { PnpmAdapter } from "./pnpm.js";
export { NpmAdapter } from "./npm.js";
export { YarnAdapter } from "./yarn.js";
export { BunAdapter } from "./bun.js";

/**
 * Factory — returns the correct adapter for a given package manager name.
 * This is the single place in the codebase that maps names to adapters.
 */
export function createPackageManagerAdapter(pm: PackageManager): PackageManagerAdapter {
  switch (pm) {
    case "pnpm":
      return new PnpmAdapter();
    case "npm":
      return new NpmAdapter();
    case "yarn":
      return new YarnAdapter();
    case "bun":
      return new BunAdapter();
    default: {
      // Exhaustiveness check — TypeScript will error here if a new PM is added to the union without updating this switch
      const _exhaustive: never = pm;
      throw new Error(`Unknown package manager: ${String(_exhaustive)}`);
    }
  }
}

/**
 * Resolve the dependency manifest devDependencies install command for a given adapter.
 * Convenience wrapper used by the generator.
 */
export function buildInstallDevCommand(adapter: PackageManagerAdapter, packages: string[]): string {
  if (packages.length === 0) return "";
  return adapter.addDevCommand(packages);
}

/**
 * All supported package managers in display order for prompts.
 */
export const PACKAGE_MANAGER_CHOICES: PackageManager[] = ["pnpm", "npm", "yarn", "bun"];
