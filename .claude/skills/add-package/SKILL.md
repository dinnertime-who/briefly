---
name: add-package
description: Scaffold a new shared package in the briefly monorepo under packages/. Use this skill whenever the user asks to add a package, create a shared library, add a new package to the monorepo, or create something like @briefly/xxx. Always use this when the user wants a new reusable module that multiple apps will share.
user-invocable: true
arguments:
  - name: package-name
    description: "Package name without the @briefly/ scope (e.g. 'email', 'redis', 'analytics')"
    required: true
---

Scaffold a new shared package `@briefly/<package-name>` in `packages/<package-name>/`.

## Core principles

- **tsup is the build tool.** All packages in this monorepo build with `tsup`. Never use `tsc` directly for the build script.
- **Dual ESM + CJS output.** tsup outputs both `dist/index.js` (ESM) and `dist/index.cjs` (CJS) with type declarations.
- The package extends `@briefly/typescript-config` — no standalone `tsconfig.cjs.json` needed.

---

## File structure to create

```
packages/<package-name>/
├── src/
│   └── index.ts          # Public API entry point
├── package.json
├── tsconfig.json
└── tsup.config.ts
```

---

## File templates

### `package.json`

```json
{
  "name": "@briefly/<package-name>",
  "version": "0.1.0",
  "type": "module",
  "files": ["dist", "package.json"],
  "exports": {
    ".": {
      "import": {
        "types": "./dist/index.d.ts",
        "default": "./dist/index.js"
      },
      "require": {
        "types": "./dist/index.d.cts",
        "default": "./dist/index.cjs"
      }
    }
  },
  "scripts": {
    "build": "tsup"
  },
  "dependencies": {},
  "devDependencies": {
    "@briefly/typescript-config": "workspace:*",
    "@types/node": "^24.12.0",
    "tsup": "^8.5.1",
    "typescript": "6.0.2"
  }
}
```

> Add runtime dependencies to `dependencies`, not `devDependencies`.

### `tsconfig.json`

```json
{
  "extends": "@briefly/typescript-config/base.json",
  "compilerOptions": {
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "rootDir": "./src",
    "ignoreDeprecations": "6.0"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

> `ignoreDeprecations: "6.0"` is required because TS 6.0 deprecated `baseUrl` (used internally by tsup's DTS builder). The IDE may show a false positive warning — the actual TS 6.0 compiler accepts this value correctly.

### `tsup.config.ts`

```ts
import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  outDir: "dist",
})
```

### `src/index.ts`

Start with a placeholder and fill in as needed:

```ts
// TODO: implement @briefly/<package-name>
export {}
```

---

## After creating files

1. Install dependencies from the repo root:
   ```bash
   pnpm install
   ```

2. Verify the build works:
   ```bash
   pnpm --filter @briefly/<package-name> build
   ```
   Expected output: `dist/index.js`, `dist/index.cjs`, `dist/index.d.ts`, `dist/index.d.cts`

3. To use from an app, add to that app's `package.json`:
   ```json
   "@briefly/<package-name>": "workspace:*"
   ```
   Then import as:
   ```ts
   import { something } from "@briefly/<package-name>"
   ```

---

## Special cases

### Package with sub-paths (e.g. `@briefly/ui/components/*`)

Add additional `exports` entries and corresponding tsup `entry` patterns:

```json
"exports": {
  "./components/*": {
    "import": { "types": "./dist/components/*.d.ts", "default": "./dist/components/*.js" },
    "require": { "types": "./dist/components/*.d.cts", "default": "./dist/components/*.cjs" }
  }
}
```

```ts
// tsup.config.ts
entry: ["src/index.ts", "src/components/*.ts"]
```

### Package that needs Drizzle / DB access

Add to `dependencies`:
```json
"drizzle-orm": "^0.45.2",
"postgres": "^3.4.8"
```
And add drizzle-kit scripts:
```json
"generate": "drizzle-kit generate",
"push": "drizzle-kit push",
"studio": "drizzle-kit studio"
```
Add `"drizzle"` to `files` array so migration files are included in the published package.

---

After scaffolding, print the created file tree and confirm the build succeeded.
