import type { PackageManagerAdapter } from "./types.js";

export class YarnAdapter implements PackageManagerAdapter {
  readonly name = "yarn" as const;

  installCommand(): string {
    // Yarn classic uses plain "yarn", Yarn Berry uses "yarn install" — classic is more common for new packages
    return "yarn";
  }

  addCommand(packages: string[]): string {
    return `yarn add ${packages.join(" ")}`;
  }

  addDevCommand(packages: string[]): string {
    return `yarn add --dev ${packages.join(" ")}`;
  }

  runCommand(script: string): string {
    return `yarn ${script}`;
  }

  execCommand(command: string): string {
    return `yarn dlx ${command}`;
  }

  testCommand(): string {
    return "yarn test";
  }

  buildCommand(): string {
    return "yarn build";
  }
}
