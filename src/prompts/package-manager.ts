import * as p from "@clack/prompts";
import type { PackageManager } from "../config/types.js";

/**
 * Asks the user to pick a package manager.
 * Always presented — cannot be skipped by --flat.
 */
export async function promptPackageManager(): Promise<PackageManager> {
  const value = await p.select<PackageManager>({
    message: "Which package manager are you using?",
    options: [
      { value: "pnpm", label: "pnpm" },
      { value: "npm", label: "npm" },
      { value: "yarn", label: "yarn" },
      { value: "bun", label: "bun" },
    ],
    initialValue: "pnpm",
  });

  if (p.isCancel(value)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  return value;
}
