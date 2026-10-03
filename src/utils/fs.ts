import { existsSync, readdirSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import { dirname } from "path";

/**
 * Safely checks whether a path exists on disk.
 */
export function pathExists(filePath: string): boolean {
  return existsSync(filePath);
}

/**
 * Returns true when the directory exists and has no entries.
 */
export function isEmptyDirectory(dirPath: string): boolean {
  if (!existsSync(dirPath)) return true; // non-existing is treated as "empty"
  try {
    return readdirSync(dirPath).length === 0;
  } catch {
    return false;
  }
}

/**
 * Returns true when the directory exists and has at least one entry.
 */
export function isNonEmptyDirectory(dirPath: string): boolean {
  if (!existsSync(dirPath)) return false;
  try {
    return readdirSync(dirPath).length > 0;
  } catch {
    return false;
  }
}

/**
 * Returns true when a package.json exists inside the given directory.
 */
export function hasPackageJson(dirPath: string): boolean {
  return existsSync(`${dirPath}/package.json`);
}

/**
 * Recursively creates a directory tree (like mkdir -p).
 */
export async function ensureDir(dirPath: string): Promise<void> {
  await mkdir(dirPath, { recursive: true });
}

/**
 * Writes content to a file, creating parent directories as needed.
 */
export async function writeFileSafe(filePath: string, content: string): Promise<void> {
  await ensureDir(dirname(filePath));
  await writeFile(filePath, content, "utf-8");
}

/**
 * Reads a file as UTF-8 text.
 */
export async function readFileSafe(filePath: string): Promise<string> {
  return readFile(filePath, "utf-8");
}

/**
 * Lists the names of entries (files + subdirs) in a directory.
 * Returns an empty array if the directory does not exist.
 */
export function listDir(dirPath: string): string[] {
  if (!existsSync(dirPath)) return [];
  try {
    return readdirSync(dirPath);
  } catch {
    return [];
  }
}
