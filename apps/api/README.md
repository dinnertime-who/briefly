# api

Briefly의 백엔드 API 서버입니다. NestJS 기반으로 REST API를 제공하며, `@briefly/db` 패키지를 통해 데이터베이스에 접근합니다.

## 기술 스택

- **NestJS** 11
- **@briefly/db** — Drizzle ORM 기반 DB 패키지
- 기본 포트: **8000** (`PORT` 환경변수로 변경 가능)

## 개발 서버 실행

```bash
# 루트에서
pnpm dev

# 이 앱만 (watch 모드)
pnpm --filter api dev
```

## 빌드 & 프로덕션

```bash
pnpm --filter api build
pnpm --filter api start
```

## 테스트

```bash
# 유닛 테스트
pnpm --filter api test

# e2e 테스트
pnpm --filter api test:e2e

# 커버리지
pnpm --filter api test:cov
```
