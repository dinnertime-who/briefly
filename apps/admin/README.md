# admin

Briefly의 관리자 대시보드 앱입니다. Next.js 기반으로 내부 운영 UI를 제공합니다.

## 기술 스택

- **Next.js** 16 (App Router)
- **React** 19
- **@briefly/ui** — 공유 UI 컴포넌트 패키지

## 개발 서버 실행

```bash
# 루트에서
pnpm dev

# 이 앱만
pnpm --filter admin dev
```

http://localhost:3001 에서 확인하세요.

## 빌드 & 프로덕션

```bash
pnpm --filter admin build
pnpm --filter admin start
```
