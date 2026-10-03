/**
 * Minimal logger abstraction.
 * Centralises all terminal output so we never scatter raw console.log calls.
 */

// ANSI colour codes — tiny, no dependency needed
const c = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  dim: "\x1b[2m",
  bold: "\x1b[1m",
} as const;

function stamp(icon: string, color: string, message: string): void {
  process.stdout.write(`${color}${icon}${c.reset} ${message}\n`);
}

export const logger = {
  /** ✔ success — green */
  success(message: string): void {
    stamp("✔", c.green, message);
  },

  /** ✖ error — red, goes to stderr */
  error(message: string): void {
    process.stderr.write(`${c.red}✖${c.reset} ${message}\n`);
  },

  /** ⚠ warning — yellow */
  warn(message: string): void {
    stamp("⚠", c.yellow, message);
  },

  /** ℹ info — cyan */
  info(message: string): void {
    stamp("ℹ", c.cyan, message);
  },

  /** Dimmed helper text, no icon */
  dim(message: string): void {
    process.stdout.write(`${c.dim}${message}${c.reset}\n`);
  },

  /** Bold section header */
  title(message: string): void {
    process.stdout.write(`\n${c.bold}${message}${c.reset}\n`);
  },

  /** Plain stdout line — for next-steps output etc. */
  log(message: string): void {
    process.stdout.write(`${message}\n`);
  },

  /** Empty line */
  newline(): void {
    process.stdout.write("\n");
  },
};
