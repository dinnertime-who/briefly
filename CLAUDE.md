# Briefly — CLAUDE.md

## 프로젝트 개요

pnpm + Turborepo 기반 모노레포.

- **apps/web** — Next.js (React 19)
- **apps/api** — NestJS
- **apps/worker** — Hono + BullMQ
- **packages/auth** — Better Auth 설정 (`@briefly/auth`)
- **packages/db** — Drizzle ORM 스키마 및 클라이언트 (`@briefly/db`)
- **packages/email** — Resend + React Email 이메일 발송 (`@briefly/email`)
- **packages/ui** — 공유 UI 컴포넌트 (`@briefly/ui`)
- **packages/typescript-config** — 공유 TypeScript 설정

## 명령어

```sh
pnpm build          # 전체 빌드 (Turborepo)
pnpm dev            # 전체 dev 서버
pnpm check          # Biome 포맷 + 린트 (--write)
pnpm lint           # Biome 린트만
pnpm format         # Biome 포맷만

pnpm --filter @briefly/email build   # 특정 패키지만 빌드
```

## 코드 규칙

### TypeScript

- **`interface` 대신 `type`을 사용한다.** 선언 병합(declaration merging)이 명시적으로 필요한 경우에만 `interface`를 허용한다.

  ```ts
  // ❌
  export interface UserProps {
    id: string;
    name: string;
  }

  // ✅
  export type UserProps = {
    id: string;
    name: string;
  };
  ```

- 패키지 public API의 타입은 반드시 `export type`으로 명시적으로 re-export한다.

### 패키지 구조

- 빌드가 필요한 패키지는 `tsup`을 사용한다 (ESM + CJS + DTS).
- `tsconfig.json`은 `@briefly/typescript-config/base.json` 또는 `react-library.json`을 확장한다.
- 서버 전용 코드와 클라이언트 코드가 혼재할 경우 엔트리포인트를 분리한다 (`index.ts` / `client.ts`).

### 패키지 간 의존성

- 모노레포 내 패키지는 `workspace:*`로 참조한다.
- 환경변수는 패키지 내부에서 직접 읽지 않고, 소비하는 앱(app)에서 주입한다.

### 데이터베이스

- Drizzle ORM 스키마는 `packages/db/src/schemas/`에 도메인별로 파일을 분리한다.
- PK는 `ulidPk()`, 생성/수정 시각은 `createdAt()` / `updatedAt()` 헬퍼를 사용한다 (`packages/db/src/core/schema-columns.ts`).
- 스키마 변경 후 반드시 `drizzle generate`를 실행하고 마이그레이션 파일을 커밋한다.
