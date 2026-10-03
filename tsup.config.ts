import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    "cli/index": "src/cli/index.ts",
    index: "src/index.ts",
  },
  format: ["esm"],
  target: "node18",
  outDir: "dist",
  clean: true,
  dts: true,
  sourcemap: true,
  splitting: false,
  // Copy templates directory into dist
  onSuccess: async () => {
    const { execSync } = await import("child_process");
    try {
      execSync("node scripts/copy-templates.js", { stdio: "inherit" });
    } catch {
      // Ignore if script doesn't exist yet
    }
  },
});
