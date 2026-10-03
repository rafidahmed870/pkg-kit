import type { PackageManagerAdapter } from "./types.js";

export class BunAdapter implements PackageManagerAdapter {
  readonly name = "bun" as const;

  installCommand(): string {
    return "bun install";
  }

  addCommand(packages: string[]): string {
    return `bun add ${packages.join(" ")}`;
  }

  addDevCommand(packages: string[]): string {
    return `bun add --dev ${packages.join(" ")}`;
  }

  runCommand(script: string): string {
    return `bun run ${script}`;
  }

  execCommand(command: string): string {
    return `bunx ${command}`;
  }

  testCommand(): string {
    return "bun test";
  }

  buildCommand(): string {
    return "bun run build";
  }
}
