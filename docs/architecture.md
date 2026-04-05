# Briefly — 아키텍처

## 모노레포 구조

```
briefly/
├── apps/
│   ├── web/        # Next.js 프론트엔드 (React 19, App Router)
│   ├── api/        # NestJS REST API 서버
│   ├── worker/     # Hono HTTP + BullMQ 백그라운드 작업
│   └── admin/      # 관리자 앱
├── packages/
│   ├── auth/       # Better Auth 설정 (@briefly/auth)
│   ├── db/         # Drizzle ORM 스키마 + 클라이언트 (@briefly/db)
│   ├── email/      # Resend + React Email (@briefly/email)
│   ├── ui/         # 공유 UI 컴포넌트 (@briefly/ui)
│   └── typescript-config/  # 공유 tsconfig
├── docs/           # 지식 베이스 (기록 시스템)
└── .claude/        # AI 하네스 설정 (skills, hooks)
```

## 패키지 의존성 방향

```
apps/* (web, api, worker)
    ↓ 소비
packages/* (auth, db, email, ui)
    ↓ 소비
외부 라이브러리
```

**규칙**:
- `apps/*`는 `packages/*`에 의존할 수 있다.
- `packages/*`는 다른 `packages/*`에 의존할 수 있되, 순환 의존성은 금지.
- `packages/*`는 `apps/*`에 절대 의존하지 않는다.
- 모노레포 내 참조는 `workspace:*`로 선언한다.

## 앱별 책임

### apps/web
- 사용자 인터페이스 전담.
- Feature Sliced Design(FSD) 아키텍처 적용.
- 서버 컴포넌트와 클라이언트 컴포넌트를 명확히 분리.
- API 통신은 `src/shared/api/`에서 관리.

### apps/api
- REST API 엔드포인트 전담.
- 비즈니스 로직은 Service 레이어에만 위치.
- DB 접근은 `@briefly/db`를 통해서만 수행.
- 인증은 `@briefly/auth`의 Better Auth 사용.

### apps/worker
- 백그라운드 작업(BullMQ) 및 HTTP 인터페이스(Hono) 전담.
- 큐 이름, 작업 타입은 타입으로 명시적으로 정의.

### packages/db
- DB 스키마의 단일 진실 공급원(Single Source of Truth).
- 스키마 변경은 반드시 마이그레이션 파일을 수반.
- 앱이 직접 DB에 접근하지 않고 반드시 이 패키지를 경유.

### packages/auth
- Better Auth 설정의 단일 진실 공급원.
- 서버 전용 엔트리(`index.ts`)와 클라이언트 엔트리(`client.ts`)를 분리.

## 환경변수 관리

- 환경변수는 패키지 내부에서 직접 읽지 않는다.
- 소비하는 앱(`apps/*`)에서 주입하고, 패키지는 인자(argument)로 받는다.
- `.env` 파일은 각 앱 루트에 위치한다.
