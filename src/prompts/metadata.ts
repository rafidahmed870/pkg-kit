import * as p from "@clack/prompts";
import { PROMPT_DEFAULTS } from "../config/defaults.js";
import type { Language, PackageManager, PackageMetadata } from "../config/types.js";
import { validatePackageNameInput, validateVersionInput } from "../utils/validation.js";

export interface MetadataPromptOptions {
  /** Pre-derived name from target directory — shown as default */
  defaultName: string;
  language: Language;
  packageManager: PackageManager;
  /** When true, only ask for the package name (skip optional fields) */
  flat: boolean;
}

/**
 * Collects npm init-style metadata from the user.
 *
 * Full mode  → asks name, version, description, entry, test command,
 *              repository, keywords, author, license.
 * Flat mode  → asks only for the package name (if it can't be derived).
 *              Everything else uses sensible defaults.
 */
export async function promptMetadata(opts: MetadataPromptOptions): Promise<PackageMetadata> {
  const { defaultName, language, packageManager, flat } = opts;
  const ext = language === "typescript" ? "ts" : "js";
  const defaultEntry = PROMPT_DEFAULTS.entry[language];
  const defaultTestCmd = packageManager === "npm" ? "npm test" : `${packageManager} test`;

  // ── Package name (always asked if not derivable) ─────────────────────────
  let name: string = defaultName;

  if (!defaultName || flat) {
    // In flat mode we still need a valid name
    const nameValue = await p.text({
      message: "Package name:",
      placeholder: defaultName || "my-package",
      initialValue: defaultName,
      validate: validatePackageNameInput,
    });

    if (p.isCancel(nameValue)) {
      p.cancel("Operation cancelled.");
      process.exit(0);
    }

    name = (nameValue as string).trim() || defaultName;
  }

  // ── Flat mode — return with defaults ─────────────────────────────────────
  if (flat) {
    return {
      name,
      version: PROMPT_DEFAULTS.version,
      description: "",
      entry: `src/index.${ext}`,
      testCommand: defaultTestCmd,
      repository: undefined,
      keywords: [],
      author: undefined,
      license: PROMPT_DEFAULTS.license,
    };
  }

  // ── Full interactive mode ─────────────────────────────────────────────────
  const answers = await p.group(
    {
      version: () =>
        p.text({
          message: "Version:",
          placeholder: PROMPT_DEFAULTS.version,
          initialValue: PROMPT_DEFAULTS.version,
          validate: validateVersionInput,
        }),

      description: () =>
        p.text({
          message: "Description:",
          placeholder: "A short description of your package",
        }),

      entry: () =>
        p.text({
          message: "Entry point:",
          placeholder: defaultEntry,
          initialValue: defaultEntry,
        }),

      testCommand: () =>
        p.text({
          message: "Test command:",
          placeholder: defaultTestCmd,
          initialValue: defaultTestCmd,
        }),

      repository: () =>
        p.text({
          message: "Git repository: (optional)",
          placeholder: "https://github.com/username/my-package",
        }),

      keywords: () =>
        p.text({
          message: "Keywords: (comma-separated, optional)",
          placeholder: "utility, tools",
        }),

      author: () =>
        p.text({
          message: "Author: (optional)",
          placeholder: "Your Name",
        }),

      license: () =>
        p.text({
          message: "License:",
          placeholder: PROMPT_DEFAULTS.license,
          initialValue: PROMPT_DEFAULTS.license,
        }),
    },
    {
      onCancel: () => {
        p.cancel("Operation cancelled.");
        process.exit(0);
      },
    },
  );

  // Normalise keywords from "a, b, c" → ["a", "b", "c"]
  const rawKeywords = (answers.keywords as string | undefined) ?? "";
  const keywords = rawKeywords
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  return {
    name,
    version: ((answers.version as string | undefined) ?? PROMPT_DEFAULTS.version).trim(),
    description: ((answers.description as string | undefined) ?? "").trim(),
    entry: ((answers.entry as string | undefined) ?? defaultEntry).trim() || defaultEntry,
    testCommand:
      ((answers.testCommand as string | undefined) ?? defaultTestCmd).trim() || defaultTestCmd,
    repository: ((answers.repository as string | undefined) ?? "").trim() || undefined,
    keywords,
    author: ((answers.author as string | undefined) ?? "").trim() || undefined,
    license: ((answers.license as string | undefined) ?? PROMPT_DEFAULTS.license).trim(),
  };
}
