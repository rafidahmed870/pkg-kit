// ─── Core domain types ────────────────────────────────────────────────────────

export type Language = "typescript" | "javascript";

export type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

export type TestRunner = "vitest" | "jest";

// ─── npm package metadata ─────────────────────────────────────────────────────

export interface PackageMetadata {
  name: string;
  version: string;
  description: string;
  entry: string;
  testCommand: string;
  repository?: string;
  keywords: string[];
  author?: string;
  license: string;
}

// ─── Fully normalized config that drives the generator ───────────────────────

export interface PkgKitConfig {
  targetDirectory: string;
  package: PackageMetadata;
  language: Language;
  packageManager: PackageManager;
  testRunner: TestRunner;
  /** Whether --flat mode was requested (skips optional metadata prompts) */
  flat: boolean;
}

// ─── Template context passed to every Handlebars template ────────────────────

export interface TemplateContext {
  package: PackageMetadata;
  language: Language;
  packageManager: PackageManager;
  testRunner: TestRunner;
  isTypeScript: boolean;
  isJavaScript: boolean;
  isVitest: boolean;
  isJest: boolean;
  paths: {
    entry: string;
    test: string;
  };
  commands: {
    install: string;
    test: string;
    testWatch: string;
    build: string;
    lint: string;
    format: string;
    add: string;
  };
  year: number;
}

// ─── Dependency manifest built per configuration ─────────────────────────────

export interface DependencyManifest {
  dependencies: string[];
  devDependencies: string[];
}
