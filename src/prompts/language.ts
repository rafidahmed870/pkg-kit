import * as p from "@clack/prompts";
import type { Language } from "../config/types.js";

/**
 * Asks the user to pick TypeScript or JavaScript.
 * Always presented — cannot be skipped by --flat.
 */
export async function promptLanguage(): Promise<Language> {
  const value = await p.select<Language>({
    message: "Are you using TypeScript?",
    options: [
      { value: "typescript", label: "TypeScript" },
      { value: "javascript", label: "JavaScript" },
    ],
    initialValue: "typescript",
  });

  if (p.isCancel(value)) {
    p.cancel("Operation cancelled.");
    process.exit(0);
  }

  return value;
}
