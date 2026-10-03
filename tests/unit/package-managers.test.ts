import { describe, it, expect } from "vitest";
import { PnpmAdapter } from "../../src/package-managers/pnpm.js";
import { NpmAdapter } from "../../src/package-managers/npm.js";
import { YarnAdapter } from "../../src/package-managers/yarn.js";
import { BunAdapter } from "../../src/package-managers/bun.js";
import { createPackageManagerAdapter } from "../../src/package-managers/index.js";
import type { PackageManager } from "../../src/config/types.js";

// ─── PnpmAdapter ──────────────────────────────────────────────────────────────

describe("PnpmAdapter", () => {
  const pm = new PnpmAdapter();

  it("name is pnpm", () => expect(pm.name).toBe("pnpm"));
  it("installCommand returns pnpm install", () => expect(pm.installCommand()).toBe("pnpm install"));
  it("addCommand includes packages", () =>
    expect(pm.addCommand(["lodash"])).toBe("pnpm add lodash"));
  it("addDevCommand includes -D flag", () =>
    expect(pm.addDevCommand(["vitest"])).toBe("pnpm add -D vitest"));
  it("runCommand prefixes with pnpm run", () =>
    expect(pm.runCommand("build")).toBe("pnpm run build"));
  it("execCommand uses dlx", () => expect(pm.execCommand("cowsay")).toBe("pnpm dlx cowsay"));
  it("testCommand returns pnpm test", () => expect(pm.testCommand()).toBe("pnpm test"));
  it("buildCommand returns pnpm build", () => expect(pm.buildCommand()).toBe("pnpm build"));
});

// ─── NpmAdapter ───────────────────────────────────────────────────────────────

describe("NpmAdapter", () => {
  const pm = new NpmAdapter();

  it("name is npm", () => expect(pm.name).toBe("npm"));
  it("installCommand returns npm install", () => expect(pm.installCommand()).toBe("npm install"));
  it("addCommand uses npm install", () =>
    expect(pm.addCommand(["lodash"])).toBe("npm install lodash"));
  it("addDevCommand uses --save-dev", () =>
    expect(pm.addDevCommand(["vitest"])).toBe("npm install --save-dev vitest"));
  it("runCommand uses npm run", () => expect(pm.runCommand("build")).toBe("npm run build"));
  it("execCommand uses npx", () => expect(pm.execCommand("cowsay")).toBe("npx cowsay"));
  it("testCommand returns npm test", () => expect(pm.testCommand()).toBe("npm test"));
  it("buildCommand returns npm run build", () => expect(pm.buildCommand()).toBe("npm run build"));
});

// ─── YarnAdapter ──────────────────────────────────────────────────────────────

describe("YarnAdapter", () => {
  const pm = new YarnAdapter();

  it("name is yarn", () => expect(pm.name).toBe("yarn"));
  it("installCommand returns yarn", () => expect(pm.installCommand()).toBe("yarn"));
  it("addCommand uses yarn add", () => expect(pm.addCommand(["lodash"])).toBe("yarn add lodash"));
  it("addDevCommand uses --dev", () =>
    expect(pm.addDevCommand(["vitest"])).toBe("yarn add --dev vitest"));
  it("runCommand uses yarn <script>", () => expect(pm.runCommand("build")).toBe("yarn build"));
  it("execCommand uses yarn dlx", () => expect(pm.execCommand("cowsay")).toBe("yarn dlx cowsay"));
  it("testCommand returns yarn test", () => expect(pm.testCommand()).toBe("yarn test"));
  it("buildCommand returns yarn build", () => expect(pm.buildCommand()).toBe("yarn build"));
});

// ─── BunAdapter ───────────────────────────────────────────────────────────────

describe("BunAdapter", () => {
  const pm = new BunAdapter();

  it("name is bun", () => expect(pm.name).toBe("bun"));
  it("installCommand returns bun install", () => expect(pm.installCommand()).toBe("bun install"));
  it("addCommand uses bun add", () => expect(pm.addCommand(["lodash"])).toBe("bun add lodash"));
  it("addDevCommand uses --dev", () =>
    expect(pm.addDevCommand(["vitest"])).toBe("bun add --dev vitest"));
  it("runCommand uses bun run", () => expect(pm.runCommand("build")).toBe("bun run build"));
  it("execCommand uses bunx", () => expect(pm.execCommand("cowsay")).toBe("bunx cowsay"));
  it("testCommand returns bun test", () => expect(pm.testCommand()).toBe("bun test"));
  it("buildCommand returns bun run build", () => expect(pm.buildCommand()).toBe("bun run build"));
});

// ─── Factory ──────────────────────────────────────────────────────────────────

describe("createPackageManagerAdapter", () => {
  const cases: PackageManager[] = ["pnpm", "npm", "yarn", "bun"];

  it.each(cases)("creates %s adapter", (pm) => {
    const adapter = createPackageManagerAdapter(pm);
    expect(adapter.name).toBe(pm);
  });

  it("throws for unknown package manager", () => {
    expect(() => createPackageManagerAdapter("deno" as PackageManager)).toThrow();
  });
});
