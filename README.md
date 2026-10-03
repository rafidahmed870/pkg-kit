# create-pkg-kit

A production-ready CLI for scaffolding modern npm packages in seconds.

No manual configuration. Just answer a few questions and get a fully wired project with TypeScript or JavaScript, your preferred package manager, test runner, build tooling, linting, formatting, CI workflow, and documentation — all ready to go.

```bash
npm create pkg-kit
# or
npx create-pkg-kit
```

---

## Features

- **TypeScript or JavaScript** — full support for both
- **Package manager choice** — pnpm, npm, yarn, or bun
- **Test runner choice** — Vitest or Jest
- **Build tooling** — tsup pre-configured
- **Linting** — oxlint
- **Formatting** — Prettier
- **CI workflow** — GitHub Actions out of the box
- **Documentation** — README, CONTRIBUTING, SECURITY, LICENSE generated from your metadata
- **`--flat` mode** — skip optional prompts and use sensible defaults
- **Safe by default** — never silently overwrites existing files

---

## Quick Start

```bash
npx create-pkg-kit
```

Or scaffold directly into a named directory:

```bash
npx create-pkg-kit my-package
```

Or into the current directory:

```bash
npx create-pkg-kit .
```

---

## Usage

### Interactive mode (default)

```bash
npx create-pkg-kit my-package
```

You will be asked:

```
✔ Package name: my-package
✔ Version: 1.0.0
✔ Description: A utility package
✔ Entry point: src/index.ts
✔ Author: Your Name
✔ License: MIT

? Are you using TypeScript?
❯ TypeScript
  JavaScript

? Which package manager are you using?
❯ pnpm
  npm
  yarn
  bun

? Which are you using for testing?
❯ Vitest
  Jest
```

Then:

```
Creating package...
✔ Created 14 files

? Install dependencies now? (pnpm install) › Yes

? Initialize a git repository? › Yes

Package created successfully!

Next steps:
  cd my-package
  pnpm test
  pnpm build
```

---

### Flat mode

Skip optional metadata prompts and use sensible defaults. The three required questions (language, package manager, test runner) are always asked.

```bash
npx create-pkg-kit my-package --flat
```

**Flat mode defaults:**

| Field        | Default                              |
| ------------ | ------------------------------------ |
| version      | `1.0.0`                              |
| description  | _(empty)_                            |
| entry point  | `src/index.ts` / `src/index.js`      |
| test command | `<pm> test`                          |
| license      | `MIT`                                |

The package name is derived from the target directory name automatically.

---

## Generated Project Structure

### TypeScript + Vitest + pnpm

```
my-package/
├── src/
│   └── index.ts
├── tests/
│   └── index.test.ts
├── .github/
│   └── workflows/
│       └── ci.yml
├── .gitignore
├── .npmignore
├── .oxlintrc.json
├── CONTRIBUTING.md
├── LICENSE
├── prettier.config.js
├── README.md
├── SECURITY.md
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
└── package.json
```

### JavaScript + Jest + npm

Same structure with `jsconfig.json`, `jest.config.js`, and `src/index.js` instead.

---

## Generated `package.json`

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "test": "vitest --run",
    "test:watch": "vitest",
    "lint": "oxlint .",
    "format": "prettier --write .",
    "typecheck": "tsc --noEmit",
    "prepublishOnly": "pnpm build && pnpm test"
  }
}
```

---

## CLI Reference

```
create-pkg-kit [directory] [options]
```

| Argument / Option  | Description                                             |
| ------------------ | ------------------------------------------------------- |
| `directory`        | Target directory. Use `.` for current dir.              |
| `--flat`           | Skip optional metadata prompts, use defaults.           |
| `--help`, `-h`     | Show help.                                              |
| `--version`, `-v`  | Show the CLI version.                                   |

---

## Supported Configurations

All 16 combinations are supported and tested:

| Language   | Package Manager | Test Runner |
| ---------- | --------------- | ----------- |
| TypeScript | pnpm            | Vitest      |
| TypeScript | npm             | Vitest      |
| TypeScript | yarn            | Vitest      |
| TypeScript | bun             | Vitest      |
| TypeScript | pnpm            | Jest        |
| TypeScript | npm             | Jest        |
| TypeScript | yarn            | Jest        |
| TypeScript | bun             | Jest        |
| JavaScript | pnpm            | Vitest      |
| JavaScript | npm             | Vitest      |
| JavaScript | yarn            | Vitest      |
| JavaScript | bun             | Vitest      |
| JavaScript | pnpm            | Jest        |
| JavaScript | npm             | Jest        |
| JavaScript | yarn            | Jest        |
| JavaScript | bun             | Jest        |

---

## Development

### Clone the repo

```bash
git clone https://github.com/rafidahmed870/pkg-kit.git
cd pkg-kit
```

### Install dependencies

```bash
pnpm install
```

### Run tests

```bash
pnpm test
```

### Build

```bash
pnpm build
```

### Lint

```bash
pnpm lint
```

### Format

```bash
pnpm format
```

---

## How It Works

```
CLI arguments / prompts
        │
        ▼
  Normalized Config
        │
    ┌───┴───────────────┐
    ▼                   ▼
Template            Package Manager
Resolver              Adapter
    │                   │
    ▼                   │
Handlebars              │
Renderer                │
    │                   │
    └──────┬────────────┘
           ▼
     File Generator
           │
           ▼
  Generated npm package
```

Prompts collect configuration. Configuration drives generation. Templates only render data — no logic lives inside `.hbs` files.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## License

MIT — see [LICENSE](./LICENSE).
