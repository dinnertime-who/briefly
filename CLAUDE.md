# Briefly — CLAUDE.md

## 프로젝트 개요

pnpm + Turborepo 기반 모노레포.

| 앱/패키지 | 역할 |
|---|---|
| `apps/web` | Next.js (React 19) |
| `apps/api` | NestJS |
| `apps/worker` | Hono + BullMQ |
| `packages/auth` | Better Auth (`@briefly/auth`) |
| `packages/db` | Drizzle ORM 스키마 및 클라이언트 (`@briefly/db`) |
| `packages/email` | Resend + React Email (`@briefly/email`) |
| `packages/ui` | 공유 UI 컴포넌트 (`@briefly/ui`) |
| `packages/typescript-config` | 공유 TypeScript 설정 |

## 명령어

```sh
pnpm build          # 전체 빌드 (Turborepo)
pnpm dev            # 전체 dev 서버
pnpm check          # Biome 포맷 + 린트 (--write)
pnpm lint           # Biome 린트만
pnpm format         # Biome 포맷만

pnpm --filter <pkg> build   # 특정 패키지만 빌드
pnpm --filter @briefly/db generate  # Drizzle 마이그레이션 생성
pnpm --filter @briefly/db push      # DB 스키마 반영
```

## 문서 맵

자세한 규칙은 아래 문서를 참고한다. 작업 전 관련 문서를 반드시 읽는다.

### 아키텍처
- [전체 구조 및 패키지 레이어링](docs/architecture.md)

### 코드 컨벤션
- [TypeScript](docs/conventions/typescript.md)
- [데이터베이스 (Drizzle ORM)](docs/conventions/database.md)
- [패키지 구조 및 의존성](docs/conventions/packages.md)
- [Git 브랜치 전략](docs/conventions/git.md)
- [@briefly/utils 패키지](docs/conventions/utils.md)


### 실행 계획
- [진행 중인 계획](docs/exec-plans/active/)
- [완료된 계획](docs/exec-plans/completed/)
