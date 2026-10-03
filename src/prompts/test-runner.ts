import * as p from "@clack/prompts";
import type { TestRunner } from "../config/types.js";

/**
 * Asks the user to pick a test runner.
 * Always presented — cannot be skipped by --flat.
 */
export async function promptTestRunner(): Promise<TestRunner> {
  const value = await p.select<TestRunner>({
    message: "Which are you using for testing?",
    options: [
      { value: "vitest", label: "Vitest" },
      { value: "jest", label: "Jest" },
    ],
    initialValue: "vitest",
  });

  if (p.isCancel(value)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  return value;
}
