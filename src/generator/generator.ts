import * as p from "@clack/prompts";
import type { PkgKitConfig } from "../config/types.js";
import { createPackageManagerAdapter } from "../package-managers/index.js";
import { isGitAvailable, runCommandInherited } from "../utils/process.js";
import { logger } from "../utils/logger.js";
import { normalisePath, resolveTemplates } from "./resolver.js";
import { HandlebarsRenderer } from "./renderer.js";
import { DiskFileWriter } from "./writer.js";
import { buildTemplateContext } from "./context.js";
import type { TemplateFile } from "./resolver.js";
import type { TemplateContext } from "../config/types.js";
import type { TemplateRenderer } from "./renderer.js";
import type { FileWriter } from "./writer.js";

export interface GenerateProjectOptions {
  config: PkgKitConfig;
  /** If true, run dependency installation after generation */
  installDeps?: boolean;
  /** If true, run git init after generation */
  initGit?: boolean;
  /** Override renderer (for testing) */
  renderer?: TemplateRenderer;
  /** Override writer (for testing) */
  writer?: FileWriter;
}

export interface GenerateProjectResult {
  success: boolean;
  filesWritten: string[];
  error?: string;
}

/**
 * Core generator.
 *
 * Orchestrates:
 *   1. Config validation
 *   2. Template resolution
 *   3. Context construction
 *   4. Rendering all .hbs files into memory
 *   5. Writing all files atomically (render first, write after)
 *   6. Optional: dependency installation
 *   7. Optional: git init
 */
export async function generateProject(
  opts: GenerateProjectOptions,
): Promise<GenerateProjectResult> {
  const { config, installDeps = false, initGit = false } = opts;
  const { targetDirectory } = config;

  const renderer: TemplateRenderer = opts.renderer ?? new HandlebarsRenderer();
  const writer: FileWriter = opts.writer ?? new DiskFileWriter(targetDirectory);

  // ── 1. Resolve templates ─────────────────────────────────────────────────
  const templateFiles: TemplateFile[] = resolveTemplates({
    language: config.language,
    testRunner: config.testRunner,
  });

  if (templateFiles.length === 0) {
    return {
      success: false,
      filesWritten: [],
      error: `No templates found for ${config.language} + ${config.testRunner}. Make sure templates are bundled correctly.`,
    };
  }

  // ── 2. Build context ─────────────────────────────────────────────────────
  const context: TemplateContext = buildTemplateContext(config);

  // ── 3. Render all templates into memory (atomic: no partial writes) ──────
  const rendered: Array<{ outputPath: string; content: string }> = [];

  for (const file of templateFiles) {
    try {
      const content = await renderer.render(file.sourcePath, context);
      rendered.push({ outputPath: normalisePath(file.outputPath), content });
    } catch (err) {
      return {
        success: false,
        filesWritten: [],
        error: `Failed to render template "${file.sourcePath}": ${String(err)}`,
      };
    }
  }

  // ── 4. Write all files ────────────────────────────────────────────────────
  const filesWritten: string[] = [];

  for (const { outputPath, content } of rendered) {
    try {
      await writer.write(outputPath, content);
      filesWritten.push(outputPath);
    } catch (err) {
      return {
        success: false,
        filesWritten,
        error: `Failed to write file "${outputPath}": ${String(err)}`,
      };
    }
  }

  // ── 5. Dependency installation ────────────────────────────────────────────
  if (installDeps) {
    const adapter = createPackageManagerAdapter(config.packageManager);
    const installCmd = adapter.installCommand();
    const spinner = p.spinner();
    spinner.start(`Running ${installCmd}...`);
    const ok = runCommandInherited(installCmd, targetDirectory);
    if (ok) {
      spinner.stop(`Dependencies installed`);
    } else {
      spinner.stop(`Dependency installation failed — run "${installCmd}" manually`);
      logger.warn(`Run "${installCmd}" in the project directory to install dependencies.`);
    }
  }

  // ── 6. Git init ───────────────────────────────────────────────────────────
  if (initGit && isGitAvailable()) {
    const spinner = p.spinner();
    spinner.start("Initialising git repository...");
    const ok = runCommandInherited("git init", targetDirectory);
    if (ok) {
      spinner.stop("Git repository initialised");
    } else {
      spinner.stop("Git init failed — skipping");
    }
  } else if (initGit && !isGitAvailable()) {
    logger.warn("git not found — skipping git init.");
  }

  return { success: true, filesWritten };
}
