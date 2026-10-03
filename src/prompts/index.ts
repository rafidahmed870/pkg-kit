import * as p from "@clack/prompts";
import { derivePackageName } from "../config/defaults.js";
import type { Language, PackageManager, PkgKitConfig, TestRunner } from "../config/types.js";
import { promptLanguage } from "./language.js";
import { promptMetadata } from "./metadata.js";
import { promptPackageManager } from "./package-manager.js";
import { promptTestRunner } from "./test-runner.js";

export { promptLanguage } from "./language.js";
export { promptMetadata } from "./metadata.js";
export { promptPackageManager } from "./package-manager.js";
export { promptTestRunner } from "./test-runner.js";

export interface CollectAnswersOptions {
  targetDirectory: string;
  flat: boolean;
}

/**
 * Top-level prompt orchestrator.
 *
 * Collects all user input and returns a fully populated PkgKitConfig.
 * The generator receives this object and never touches prompts again.
 *
 * Flow:
 *   1. Language   (mandatory)
 *   2. PackageManager (mandatory)
 *   3. TestRunner (mandatory)
 *   4. Package metadata (full or flat)
 *   5. Directory conflict confirmation (handled in CLI, not here)
 */
export async function collectAnswers(opts: CollectAnswersOptions): Promise<PkgKitConfig> {
  const { targetDirectory, flat } = opts;

  p.intro("pkg-kit");

  // ── Mandatory questions — always shown ───────────────────────────────────
  const language: Language = await promptLanguage();
  const packageManager: PackageManager = await promptPackageManager();
  const testRunner: TestRunner = await promptTestRunner();

  // ── Package metadata ──────────────────────────────────────────────────────
  const defaultName = derivePackageName(targetDirectory);

  const packageMeta = await promptMetadata({
    defaultName,
    language,
    packageManager,
    flat,
  });

  return {
    targetDirectory,
    package: packageMeta,
    language,
    packageManager,
    testRunner,
    flat,
  };
}

/**
 * Asks the user whether to proceed when the target directory is not empty.
 * Returns true if the user confirmed, false to abort.
 */
export async function confirmOverwrite(dirPath: string): Promise<boolean> {
  const answer = await p.confirm({
    message: `The directory "${dirPath}" is not empty. Continue?`,
    initialValue: false,
  });

  if (p.isCancel(answer)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  return answer as boolean;
}

/**
 * Asks whether to install dependencies.
 */
export async function confirmInstall(installCmd: string): Promise<boolean> {
  const answer = await p.confirm({
    message: `Install dependencies now? (${installCmd})`,
    initialValue: true,
  });

  if (p.isCancel(answer)) return false;
  return answer as boolean;
}

/**
 * Asks whether to initialise a Git repository.
 */
export async function confirmGitInit(): Promise<boolean> {
  const answer = await p.confirm({
    message: "Initialize a git repository?",
    initialValue: true,
  });

  if (p.isCancel(answer)) return false;
  return answer as boolean;
}
