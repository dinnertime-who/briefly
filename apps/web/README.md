# web

Briefly의 메인 웹 프론트엔드 앱입니다. Next.js 기반으로 사용자 대상 UI를 제공합니다.

## 기술 스택

- **Next.js** 16 (App Router)
- **React** 19
- **@briefly/ui** — 공유 UI 컴포넌트 패키지

## 개발 서버 실행

루트에서 전체 워크스페이스를 실행하거나, 이 앱만 단독으로 실행할 수 있습니다.

```bash
# 루트에서
pnpm dev

# 이 앱만
pnpm --filter web dev
```

http://localhost:3000 에서 확인하세요.

## 빌드 & 프로덕션

```bash
pnpm --filter web build
pnpm --filter web start
```
