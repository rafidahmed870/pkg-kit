import { existsSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import type { Language, TestRunner } from "../config/types.js";
import { getTemplatesRoot } from "../utils/paths.js";

export interface TemplateFile {
  /** Absolute path to the .hbs source file */
  sourcePath: string;
  /**
   * Output path relative to the target directory.
   * e.g. "src/index.ts", ".gitignore", "tests/index.test.ts"
   */
  outputPath: string;
}

/**
 * Recursively collects all .hbs files under a directory.
 * Returns TemplateFile entries with output paths relative to `baseOutputDir`.
 */
function collectTemplates(sourceDir: string, baseOutputDir: string): TemplateFile[] {
  if (!existsSync(sourceDir)) return [];

  const results: TemplateFile[] = [];

  function walk(dir: string): void {
    const entries = readdirSync(dir);
    for (const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (entry.endsWith(".hbs")) {
        // Strip .hbs extension for the output filename
        const relFromSource = relative(sourceDir, fullPath);
        const outputRel = relFromSource.replace(/\.hbs$/, "");
        const outputPath = baseOutputDir ? join(baseOutputDir, outputRel) : outputRel;
        results.push({ sourcePath: fullPath, outputPath });
      }
    }
  }

  walk(sourceDir);
  return results;
}

export interface ResolveTemplatesOptions {
  language: Language;
  testRunner: TestRunner;
}

/**
 * Resolves the full list of template files to render for a given configuration.
 *
 * Resolution order:
 *   1. shared/        → files common to all configurations
 *   2. {lang}/base/   → language-specific base files (package.json, tsconfig, src/)
 *   3. {lang}/tests/{runner}/  → test runner-specific files
 *
 * Package manager does NOT get its own template directory — it's handled via
 * the template context (commands, generated package.json scripts, etc.).
 */
export function resolveTemplates(opts: ResolveTemplatesOptions): TemplateFile[] {
  const { language, testRunner } = opts;
  const templatesRoot = getTemplatesRoot();

  const files: TemplateFile[] = [
    // 1. Shared files (README, LICENSE, .gitignore, .npmignore, CONTRIBUTING, SECURITY)
    ...collectTemplates(join(templatesRoot, "shared"), ""),

    // 2. Language base files (package.json, tsconfig/jsconfig, tsup config, src/index)
    ...collectTemplates(join(templatesRoot, language, "base"), ""),

    // 3. Test-runner specific files (config + test file)
    ...collectTemplates(join(templatesRoot, language, "tests", testRunner), ""),
  ];

  return files;
}

/**
 * Normalises Windows backslash paths to forward slashes for consistent output.
 */
export function normalisePath(p: string): string {
  return p.replace(/\\/g, "/");
}
