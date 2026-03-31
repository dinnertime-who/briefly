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
- Import `ulidPk`, `createdAt`, `updatedAt`, `deletedAt` helpers from `../core/schema-columns`
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

---

**Better Auth 스키마 참고:**

`createdAt()` / `updatedAt()` 헬퍼는 DB 컬럼을 snake_case(`created_at`, `updated_at`)로 생성하지만 Drizzle JS 필드명(객체 키)은 camelCase(`createdAt`, `updatedAt`)로 유지된다. Better Auth의 Drizzle 어댑터는 DB 컬럼명이 아닌 Drizzle 필드명 기준으로 쿼리하므로 헬퍼를 그대로 사용해도 정상 동작한다.
