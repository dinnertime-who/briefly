---
name: nestjs-module
description: Scaffold a NestJS module with controller and service following the briefly API conventions
user-invocable: true
arguments:
  - name: module-name
    description: The feature module name in kebab-case (e.g. "auth", "channels", "messages")
    required: true
---

Scaffold a complete NestJS feature module under `apps/api/src/<module-name>/` for the briefly project.

**Create these files:**

1. `apps/api/src/<module-name>/<module-name>.module.ts`
   - `@Module({ controllers: [...], providers: [...] })` decorator
   - Import and provide the service

2. `apps/api/src/<module-name>/<module-name>.controller.ts`
   - `@Controller('<module-name>')` decorator
   - Inject the service via constructor
   - Add placeholder route handlers matching the feature

3. `apps/api/src/<module-name>/<module-name>.service.ts`
   - `@Injectable()` decorator
   - Inject `@briefly/db` DrizzleClient if database access is needed
   - Method stubs matching the controller

**Conventions:**
- Use SWC-compatible decorators (no `emitDecoratorMetadata` workarounds needed — NestJS + SWC is already configured)
- Follow NestJS naming: `<Name>Controller`, `<Name>Service`, `<Name>Module`
- Keep imports sorted (NestJS first, then local)
- No extra comments or docstrings unless the logic is non-obvious

**After creating files:**
- Register the new module in `apps/api/src/app.module.ts` imports array
- Remind the user to add any required providers (e.g. DbModule) if database access is included

Use `$ARGUMENTS` as the module name.
