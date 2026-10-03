import { describe, it, expect } from "vitest";
import { parseCliOptions } from "../../src/cli/options.js";

describe("parseCliOptions", () => {
  it("parses a positional directory argument", () => {
    const opts = parseCliOptions(["my-package"]);
    expect(opts.targetDirectory).toBe("my-package");
    expect(opts.flat).toBe(false);
    expect(opts.help).toBe(false);
    expect(opts.version).toBe(false);
  });

  it("parses dot as target directory", () => {
    const opts = parseCliOptions(["."]);
    expect(opts.targetDirectory).toBe(".");
  });

  it("parses --flat flag", () => {
    const opts = parseCliOptions(["my-package", "--flat"]);
    expect(opts.flat).toBe(true);
    expect(opts.targetDirectory).toBe("my-package");
  });

  it("parses --help flag", () => {
    expect(parseCliOptions(["--help"]).help).toBe(true);
  });

  it("parses -h alias", () => {
    expect(parseCliOptions(["-h"]).help).toBe(true);
  });

  it("parses --version flag", () => {
    expect(parseCliOptions(["--version"]).version).toBe(true);
  });

  it("parses -v alias", () => {
    expect(parseCliOptions(["-v"]).version).toBe(true);
  });

  it("returns undefined targetDirectory when no arg given", () => {
    expect(parseCliOptions([]).targetDirectory).toBeUndefined();
  });

  it("parses --flat without a directory", () => {
    const opts = parseCliOptions(["--flat"]);
    expect(opts.flat).toBe(true);
    expect(opts.targetDirectory).toBeUndefined();
  });
});
