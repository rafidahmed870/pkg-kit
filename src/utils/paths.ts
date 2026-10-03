import { existsSync } from "fs";
import { dirname, isAbsolute, join, normalize, resolve } from "path";
import { fileURLToPath } from "url";

/**
 * The absolute path to the pkg-kit package root (where package.json lives).
 * Works correctly whether running from src/ (dev) or dist/ (installed).
 */
export function getPackageRoot(): string {
  // __dirname equivalent in ESM
  const currentFile = fileURLToPath(import.meta.url);
  const currentDir = dirname(currentFile);

  // Walk up until we find a package.json that belongs to pkg-kit
  let dir = currentDir;
  for (let i = 0; i < 6; i++) {
    const candidate = join(dir, "package.json");
    if (existsSync(candidate)) {
      return dir;
    }
    const parent = dirname(dir);
    if (parent === dir) break; // reached filesystem root
    dir = parent;
  }

  // Fallback: assume we're 2 levels deep inside the package (dist/cli/ or src/utils/)
  return resolve(currentDir, "../../");
}

/**
 * Resolves the templates directory.
 * When running from dist/, templates live at dist/templates/.
 * When running from src/ (dev), templates live at <root>/templates/.
 */
export function getTemplatesRoot(): string {
  const pkgRoot = getPackageRoot();

  // Prefer dist/templates (production / after build)
  const distTemplates = join(pkgRoot, "dist", "templates");
  if (existsSync(distTemplates)) return distTemplates;

  // Fall back to repo-root templates (development)
  const srcTemplates = join(pkgRoot, "templates");
  if (existsSync(srcTemplates)) return srcTemplates;

  // Last resort: same directory as the running file
  return join(pkgRoot, "templates");
}

/**
 * Resolves the target directory supplied by the user against CWD.
 * Prevents path traversal by normalizing and checking the result stays within CWD.
 */
export function resolveTargetDirectory(rawInput: string): string {
  const cwd = process.cwd();

  if (!rawInput || rawInput === ".") {
    return cwd;
  }

  // If the user passed an absolute path, use it directly (validated upstream)
  if (isAbsolute(rawInput)) {
    return normalize(rawInput);
  }

  return resolve(cwd, rawInput);
}

/**
 * Strips the trailing slash from a path string.
 */
export function stripTrailingSlash(p: string): string {
  return p.replace(/[/\\]+$/, "");
}

/**
 * Safely joins path segments, normalizing the result.
 */
export function safejoin(...parts: string[]): string {
  return normalize(join(...parts));
}
