#!/usr/bin/env node
import { HELP_TEXT, parseCliOptions } from "./options.js";
import { runCreateCommand } from "./commands/create.js";
import { version } from "../version.js";

async function main(): Promise<void> {
  const opts = parseCliOptions();

  // ── --version ─────────────────────────────────────────────────────────────
  if (opts.version) {
    process.stdout.write(`create-pkg-kit v${version}\n`);
    process.exit(0);
  }

  // ── --help ────────────────────────────────────────────────────────────────
  if (opts.help) {
    process.stdout.write(HELP_TEXT);
    process.exit(0);
  }

  // ── create (default command) ──────────────────────────────────────────────
  await runCreateCommand({
    rawDirectory: opts.targetDirectory,
    flat: opts.flat,
  });
}

main().catch((err: unknown) => {
  // Clack cancels already call process.exit(0), so only genuine errors land here
  if (err instanceof Error) {
    process.stderr.write(`\n✖ Unexpected error: ${err.message}\n`);
    if (process.env["DEBUG"]) {
      process.stderr.write(`${err.stack ?? ""}\n`);
    }
  } else {
    process.stderr.write(`\n✖ Unexpected error: ${String(err)}\n`);
  }
  process.exit(1);
});
