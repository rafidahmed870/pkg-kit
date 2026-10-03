import type { PackageManager } from "../config/types.js";

/**
 * Abstraction over a package manager.
 * All commands return the shell string to execute — nothing is run here.
 */
export interface PackageManagerAdapter {
  /** Canonical name, e.g. "pnpm" */
  readonly name: PackageManager;

  /** e.g. "pnpm install" */
  installCommand(): string;

  /** e.g. "pnpm add lodash" */
  addCommand(packages: string[]): string;

  /** e.g. "pnpm add -D typescript" */
  addDevCommand(packages: string[]): string;

  /** e.g. "pnpm run build" */
  runCommand(script: string): string;

  /** e.g. "pnpm dlx cowsay" */
  execCommand(command: string): string;

  /** e.g. "pnpm test" */
  testCommand(): string;

  /** e.g. "pnpm build" */
  buildCommand(): string;
}
