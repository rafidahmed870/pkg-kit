import type { PackageManagerAdapter } from "./types.js";

export class PnpmAdapter implements PackageManagerAdapter {
  readonly name = "pnpm" as const;

  installCommand(): string {
    return "pnpm install";
  }

  addCommand(packages: string[]): string {
    return `pnpm add ${packages.join(" ")}`;
  }

  addDevCommand(packages: string[]): string {
    return `pnpm add -D ${packages.join(" ")}`;
  }

  runCommand(script: string): string {
    return `pnpm run ${script}`;
  }

  execCommand(command: string): string {
    return `pnpm dlx ${command}`;
  }

  testCommand(): string {
    return "pnpm test";
  }

  buildCommand(): string {
    return "pnpm build";
  }
}
