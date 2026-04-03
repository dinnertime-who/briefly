# 데이터베이스 컨벤션 (Drizzle ORM)

## 스키마 파일 위치

- 모든 스키마는 `packages/db/src/schemas/` 에 도메인별로 분리한다.
- 파일명: `<domain>.schema.ts` (예: `user.schema.ts`, `organization.schema.ts`)
- 새 스키마 작성 후 반드시 `packages/db/src/index.ts`에서 re-export한다.

## 필수 헬퍼 (schema-columns.ts)

모든 테이블은 `packages/db/src/core/schema-columns.ts`의 헬퍼를 사용한다.

```ts
import { ulidPk, createdAt, updatedAt, deletedAt } from "../core/schema-columns";

export const userSchema = pgTable("user", {
  id: ulidPk(),           // 항상 포함
  createdAt: createdAt(), // 항상 포함
  updatedAt: updatedAt(), // 항상 포함
  deletedAt: deletedAt(), // soft-delete 필요 시만 포함
  // ...도메인 컬럼
});
```

## 네이밍 규칙

- 테이블명 문자열: **단수 snake_case** (`"user"`, `"organization_member"`)
- 스키마 변수명: `<tableName>Schema` camelCase (`userSchema`, `organizationMemberSchema`)
- 컬럼명: snake_case

## 타입 export

```ts
export type User = typeof userSchema.$inferSelect;
export type NewUser = typeof userSchema.$inferInsert;
```

## 마이그레이션

스키마 변경 후 반드시 아래 순서를 따른다:

```sh
pnpm --filter @briefly/db generate  # 마이그레이션 파일 생성
pnpm --filter @briefly/db push      # DB에 반영
```

- 마이그레이션 파일은 커밋에 반드시 포함한다.
- 마이그레이션 없이 스키마만 변경하는 커밋은 허용하지 않는다.

## 쿼리 패턴

- DB 접근은 `apps/*`에서 직접 하지 않고, Service 레이어에서만 수행한다.
- `@briefly/db`의 `drizzle` 클라이언트를 DI(의존성 주입)로 받는다.
- 복잡한 조인은 별도 쿼리 함수로 분리한다 (SRP).
