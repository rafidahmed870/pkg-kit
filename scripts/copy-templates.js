#!/usr/bin/env node
/**
 * Copies the templates directory into dist/templates after build.
 * This ensures templates are available when the CLI runs from dist/.
 */

import { cpSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const src = join(root, "templates");
const dest = join(root, "dist", "templates");

if (!existsSync(src)) {
  console.warn("[copy-templates] templates/ directory not found, skipping.");
  process.exit(0);
}

mkdirSync(dest, { recursive: true });
cpSync(src, dest, { recursive: true });

console.log("[copy-templates] templates/ copied to dist/templates/");
