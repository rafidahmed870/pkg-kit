import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";

export interface FileWriter {
  write(destination: string, content: string): Promise<void>;
  mkdir(directory: string): Promise<void>;
  exists(filePath: string): Promise<boolean>;
}

export function normaliseLineEndings(content: string): string {
  return content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

/**
 * Concrete file writer — writes rendered content to disk.
 * All writes are relative to a base output directory.
 */
export class DiskFileWriter implements FileWriter {
  constructor(private readonly baseDir: string) {}

  async write(relativePath: string, content: string): Promise<void> {
    const fullPath = join(this.baseDir, relativePath);
    const dir = dirname(fullPath);
    const normalized = normaliseLineEndings(content);
    await mkdir(dir, { recursive: true });
    await writeFile(fullPath, normalized, "utf-8");
  }

  async mkdir(relativePath: string): Promise<void> {
    const fullPath = join(this.baseDir, relativePath);
    await mkdir(fullPath, { recursive: true });
  }

  async exists(relativePath: string): Promise<boolean> {
    const fullPath = join(this.baseDir, relativePath);
    return existsSync(fullPath);
  }
}

/**
 * In-memory file writer — used during testing to avoid touching the filesystem.
 */
export class MemoryFileWriter implements FileWriter {
  public readonly files: Map<string, string> = new Map();

  async write(destination: string, content: string): Promise<void> {
    this.files.set(destination, normaliseLineEndings(content));
  }

  async mkdir(_directory: string): Promise<void> {
    // No-op in memory
  }

  async exists(filePath: string): Promise<boolean> {
    return this.files.has(filePath);
  }
}
