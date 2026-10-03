import minimist from "minimist";

export interface CliOptions {
  /** Positional target directory argument, e.g. "my-package" or "." */
  targetDirectory: string | undefined;
  /** --flat: skip optional metadata prompts */
  flat: boolean;
  /** --help / -h */
  help: boolean;
  /** --version / -v */
  version: boolean;
}

const HELP_TEXT = `
create-pkg-kit — scaffold a production-ready npm package

USAGE
  npx create-pkg-kit [directory] [options]

ARGUMENTS
  directory   Target directory for the new package.
              Use "." to scaffold in the current directory.
              Omit to be prompted or use the current directory name.

OPTIONS
  --flat      Skip optional metadata prompts and use sensible defaults.
              The three required questions (language, package manager,
              test runner) are still always asked.
  --help, -h  Show this help text.
  --version, -v  Show the CLI version.

EXAMPLES
  npx create-pkg-kit
  npx create-pkg-kit my-package
  npx create-pkg-kit .
  npx create-pkg-kit my-package --flat
`.trimStart();

/**
 * Parses process.argv into a typed CliOptions object.
 */
export function parseCliOptions(argv: string[] = process.argv.slice(2)): CliOptions {
  const parsed = minimist(argv, {
    boolean: ["flat", "help", "version"],
    alias: {
      h: "help",
      v: "version",
    },
    "--": true,
  });

  return {
    targetDirectory: parsed._[0] as string | undefined,
    flat: Boolean(parsed["flat"]),
    help: Boolean(parsed["help"]),
    version: Boolean(parsed["version"]),
  };
}

export { HELP_TEXT };
