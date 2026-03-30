# worker

Briefly의 백그라운드 워커 서버입니다. Hono 기반의 경량 HTTP 서버로, 비동기 작업 처리를 담당합니다. `@briefly/db` 패키지를 통해 데이터베이스에 접근합니다.

## 기술 스택

- **Hono** — 경량 웹 프레임워크
- **@briefly/db** — Drizzle ORM 기반 DB 패키지
- 기본 포트: **8080**

## 개발 서버 실행

```bash
# 루트에서
pnpm dev

# 이 앱만 (watch 모드)
pnpm --filter worker dev
```

## 빌드 & 프로덕션

```bash
pnpm --filter worker build
pnpm --filter worker start
```
