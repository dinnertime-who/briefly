---
name: drizzle-schema
description: Create a new Drizzle ORM table schema following the briefly project conventions
user-invocable: true
arguments:
  - name: table-name
    description: The name of the table to create (e.g. "user", "message", "channel")
    required: true
---

Create a new Drizzle ORM schema in `packages/db/src/schemas/<table-name>.schema.ts` following the project's conventions:

**Rules:**
- Import from `drizzle-orm/pg-core` for column types
- Import `ulidPk`, `createdAt`, `updatedAt`, `deletedAt` helpers from `../core/helpers`
- Use `pgTable` to define the table
- Always include `id: ulidPk()`, `createdAt: createdAt()`, `updatedAt: updatedAt()`
- Add `deletedAt: deletedAt()` only if soft-delete is needed for this entity
- Export a type `type <TableName> = typeof <tableName>Schema.$inferSelect`
- Export a type `type New<TableName> = typeof <tableName>Schema.$inferInsert`
- Name the schema variable `<tableName>Schema` (camelCase)
- Table name string must be **singular** snake_case (e.g. `"user_message"`, not `"user_messages"`)

**After creating the schema file:**
1. Export it from `packages/db/src/index.ts`
2. Remind the user to run `pnpm --filter @briefly/db generate` then `pnpm --filter @briefly/db push` to apply the migration

Use the provided `$ARGUMENTS` as the table name. Infer reasonable columns based on the name if context is unclear, and ask the user to confirm before writing.
