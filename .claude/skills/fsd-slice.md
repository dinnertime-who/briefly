---
name: fsd-slice
description: Scaffold a Feature Sliced Design slice in apps/web following FSD conventions
user-invocable: true
arguments:
  - name: layer/slice-name
    description: "Layer and slice name separated by slash (e.g. 'features/send-message', 'entities/user', 'widgets/chat-window', 'shared/ui')"
    required: true
---

Scaffold a Feature Sliced Design slice in the `apps/web/` Next.js project.

## FSD Layer Overview

```
apps/web/
  app/                   # Next.js App Router — routing only (do NOT put FSD code here)
  src/
    shared/              # No business logic. Reusable across all layers.
    entities/            # Business entities: data shape + display
    features/            # User interactions / use cases
    widgets/             # Composite blocks combining entities + features
    views/               # Full page compositions (one per route)
```

**Import rule (strictly enforced):** upper layers can import from lower ones only.
`views` → `widgets` → `features` → `entities` → `shared`
No cross-slice imports within the same layer (use the public `index.ts` API only).

---

## Layer-specific conventions

### `shared/`
Segments allowed: `ui/`, `lib/`, `api/`, `config/`, `types/`
- `ui/` — re-exports and thin wrappers around `@briefly/ui` shadcn components. **Do NOT create custom primitive components here.** Import from `@briefly/ui/components/<name>` and re-export (or wrap with app-specific defaults) from `shared/ui/index.ts`.
- `lib/` — pure utilities and hooks
- `api/` — base HTTP/WS client setup
- `config/` — env constants, route names
- `types/` — global TypeScript types

### `entities/<name>/`
Segments: `ui/`, `model/`, `api/`, `index.ts`
- `model/` — Zustand slice **or** plain TypeScript types for this entity
- `api/` — server calls scoped to the entity (fetch, mutations)
- `ui/` — read-only display components (EntityCard, EntityBadge…)
- `index.ts` — public API: re-export only what other layers are allowed to use

### `features/<name>/`
Segments: `ui/`, `model/`, `api/`, `index.ts`
- Represents one user action / use case (send-message, login, upload-file…)
- `ui/` — interactive components (forms, buttons with side effects)
- `model/` — Zustand actions + local state for this feature
- `api/` — API calls triggered by the feature
- `index.ts` — public API

### `widgets/<name>/`
Segments: `ui/`, `index.ts`
- Combines entities + features into a self-contained UI block
- No own business logic — orchestration only
- `index.ts` — public API

### `views/<name>/`
Segments: `ui/`, `index.ts`
- One view per route; assembles widgets into the page layout
- The `app/` directory imports from `views/` only
- `index.ts` — public API

---

## Scaffold steps

Parse `$ARGUMENTS` as `<layer>/<slice-name>`.

1. Create the directory `apps/web/src/<layer>/<slice-name>/`
2. Create only the segments that make sense for the layer and the slice name:
   - Always create `index.ts` (public API barrel — export what is needed, nothing else)
   - Create segment folders with a placeholder file when relevant (e.g. `ui/<SliceName>.tsx`, `model/store.ts`, `api/queries.ts`)
3. For `model/store.ts` in `entities/` or `features/`: use **Zustand** (`create` from `zustand`)
4. For `ui/` components: use **Tailwind CSS** utility classes (no inline styles)
5. Mark every placeholder with a `// TODO:` comment so the user knows what to implement

### Special case: `shared/ui`

When the slice is `shared/ui`, **do not** create custom primitive components. Instead:

1. Identify which shadcn components from `@briefly/ui` are needed.
2. Re-export them through `apps/web/src/shared/ui/index.ts`:

```ts
// apps/web/src/shared/ui/index.ts
export { Button } from "@briefly/ui/components/button"
export { Input } from "@briefly/ui/components/input"
export { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@briefly/ui/components/card"
// … add only what is actually needed
```

3. If a component needs app-specific defaults or wrapper logic, create a thin wrapper file in `apps/web/src/shared/ui/<ComponentName>.tsx` that imports from `@briefly/ui` and extends it:

```tsx
// apps/web/src/shared/ui/AppButton.tsx
"use client"
import { Button, type ButtonProps } from "@briefly/ui/components/button"

export function AppButton(props: ButtonProps) {
  // add app-specific defaults here
  return <Button {...props} />
}
```

4. Re-export wrappers from `index.ts` as well.

**Installed shadcn components** (in `packages/ui/src/components/`):
accordion, alert-dialog, alert, aspect-ratio, avatar, badge, breadcrumb, button-group, button, calendar, card, carousel, chart, checkbox, collapsible, combobox, command, context-menu, dialog, direction, drawer, dropdown-menu, empty, field, hover-card, input-group, input-otp, input, item, kbd, label, menubar, native-select, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner, spinner, switch, table, tabs, textarea, toggle-group, toggle, tooltip

If a component you need is NOT in this list, add it to `packages/ui` first with shadcn CLI before using it in `shared/ui`.

---

**Do NOT:**
- Import from a same-layer sibling slice
- Put Next.js routing logic (page.tsx, layout.tsx) inside FSD layers — those stay in `app/`
- Create segments that are irrelevant (e.g. don't create `api/` for a pure UI widget)
- Create custom primitive components in `shared/ui` that duplicate what `@briefly/ui` already provides

After scaffolding, print the created file tree and a one-line note on what each file is for.
