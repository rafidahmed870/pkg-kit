import * as p from "@clack/prompts";
import { validateConfig } from "../../config/schema.js";
import { generateProject } from "../../generator/generator.js";
import { createPackageManagerAdapter } from "../../package-managers/index.js";
import {
  collectAnswers,
  confirmGitInit,
  confirmInstall,
  confirmOverwrite,
} from "../../prompts/index.js";
import { isGitAvailable } from "../../utils/process.js";
import { hasPackageJson, isNonEmptyDirectory } from "../../utils/fs.js";
import { resolveTargetDirectory } from "../../utils/paths.js";
import { logger } from "../../utils/logger.js";

export interface CreateCommandOptions {
  /** Raw directory argument from CLI (may be undefined) */
  rawDirectory: string | undefined;
  flat: boolean;
}

/**
 * The "create" command.
 *
 * Responsibilities:
 *   1. Resolve target directory
 *   2. Check directory safety (warn on non-empty)
 *   3. Run prompts → collect PkgKitConfig
 *   4. Validate config
 *   5. Generate project
 *   6. Offer install + git init
 *   7. Print next steps
 */
export async function runCreateCommand(opts: CreateCommandOptions): Promise<void> {
  const { rawDirectory, flat } = opts;

  // ── 1. Resolve target directory ───────────────────────────────────────────
  const targetDirectory = resolveTargetDirectory(rawDirectory ?? ".");

  // ── 2. Directory safety check ─────────────────────────────────────────────
  if (isNonEmptyDirectory(targetDirectory)) {
    if (hasPackageJson(targetDirectory)) {
      logger.error(
        `The directory "${targetDirectory}" already contains a package.json.\n  No files were written.`,
      );
      process.exit(1);
    }

    const proceed = await confirmOverwrite(targetDirectory);
    if (!proceed) {
      p.cancel("Aborted.");
      process.exit(0);
    }
  }

  // ── 3. Collect answers ────────────────────────────────────────────────────
  const config = await collectAnswers({ targetDirectory, flat });

  // ── 4. Validate config ────────────────────────────────────────────────────
  const validation = validateConfig(config);
  if (!validation.valid) {
    logger.error("Invalid configuration:");
    for (const err of validation.errors) {
      logger.error(`  • ${err}`);
    }
    process.exit(1);
  }

  // ── 5. Generate project ───────────────────────────────────────────────────
  logger.newline();
  const genSpinner = p.spinner();
  genSpinner.start("Creating package...");

  const result = await generateProject({ config });

  if (!result.success) {
    genSpinner.stop("Generation failed");
    logger.error(result.error ?? "Unknown error during generation.");
    process.exit(1);
  }

  genSpinner.stop(`Created ${result.filesWritten.length} files`);

  // ── 6. Install dependencies ───────────────────────────────────────────────
  const adapter = createPackageManagerAdapter(config.packageManager);
  const installCmd = adapter.installCommand();

  const shouldInstall = await confirmInstall(installCmd);

  if (shouldInstall) {
    await generateProject({ config, installDeps: true });
  }

  // ── 7. Git init ───────────────────────────────────────────────────────────
  const gitAvailable = isGitAvailable();
  const shouldInitGit = gitAvailable ? await confirmGitInit() : false;

  if (shouldInitGit) {
    await generateProject({ config, initGit: true });
  } else if (!gitAvailable) {
    logger.warn("git not found — skipping git init.");
  }

  // ── 8. Next steps ─────────────────────────────────────────────────────────
  p.outro("Package created successfully!");

  logger.newline();
  logger.title("Next steps:");

  const relDir =
    rawDirectory && rawDirectory !== "." ? rawDirectory : config.package.name || targetDirectory;

  // Only show cd if we're not already in the target dir
  if (rawDirectory && rawDirectory !== ".") {
    logger.log(`  cd ${relDir}`);
  }

  if (!shouldInstall) {
    logger.log(`  ${installCmd}`);
  }

  logger.log(`  ${adapter.testCommand()}`);
  logger.log(`  ${adapter.buildCommand()}`);
  logger.newline();
}
