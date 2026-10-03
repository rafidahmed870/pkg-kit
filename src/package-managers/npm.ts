import type { PackageManagerAdapter } from "./types.js";

export class NpmAdapter implements PackageManagerAdapter {
  readonly name = "npm" as const;

  installCommand(): string {
    return "npm install";
  }

  addCommand(packages: string[]): string {
    return `npm install ${packages.join(" ")}`;
  }

  addDevCommand(packages: string[]): string {
    return `npm install --save-dev ${packages.join(" ")}`;
  }

  runCommand(script: string): string {
    return `npm run ${script}`;
  }

  execCommand(command: string): string {
    return `npx ${command}`;
  }

  testCommand(): string {
    return "npm test";
  }

  buildCommand(): string {
    return "npm run build";
  }
}
