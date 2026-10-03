import Handlebars from "handlebars";
import { readFile } from "fs/promises";
import type { TemplateContext } from "../config/types.js";

// ─── Register helpers ─────────────────────────────────────────────────────────

/**
 * {{eq a b}} — equality check
 */
Handlebars.registerHelper("eq", (a: unknown, b: unknown) => a === b);

/**
 * {{ne a b}} — inequality check
 */
Handlebars.registerHelper("ne", (a: unknown, b: unknown) => a !== b);

/**
 * {{lowercase str}} — converts string to lowercase
 */
Handlebars.registerHelper("lowercase", (str: unknown) =>
  typeof str === "string" ? str.toLowerCase() : str,
);

/**
 * {{uppercase str}} — converts string to uppercase
 */
Handlebars.registerHelper("uppercase", (str: unknown) =>
  typeof str === "string" ? str.toUpperCase() : str,
);

/**
 * {{join arr sep}} — joins an array with a separator
 */
Handlebars.registerHelper("join", (arr: unknown, sep: unknown) => {
  if (!Array.isArray(arr)) return "";
  return arr.join(typeof sep === "string" ? sep : ", ");
});

/**
 * {{json value}} — JSON-stringifies a value (useful for package.json templates)
 */
Handlebars.registerHelper("json", (value: unknown) => JSON.stringify(value));

// ─── Renderer ─────────────────────────────────────────────────────────────────

export interface TemplateRenderer {
  render(templatePath: string, context: TemplateContext): Promise<string>;
}

/**
 * Handlebars-based template renderer.
 *
 * Responsibilities:
 *   - Read .hbs file from disk
 *   - Compile the Handlebars template
 *   - Execute it with the context
 *   - Return rendered string
 *
 * Does NOT write files — that is the FileWriter's job.
 */
export class HandlebarsRenderer implements TemplateRenderer {
  async render(templatePath: string, context: TemplateContext): Promise<string> {
    const source = await readFile(templatePath, "utf-8");
    const template = Handlebars.compile(source, { noEscape: true });
    return template(context);
  }
}
