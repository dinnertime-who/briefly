# ⚡️ Briefly (브리플리)

> **"채팅은 가볍게, 업무 정리는 완벽하게"**
> 실시간 채팅과 AI 요약/할 일(Action Item) 추출을 결합한 B2B 생산성 메신저

## 🏗️ Architecture & Tech Stack

가장 빠르고 안정적인 가설 검증을 위해, 검증된 기술 스택과 모노레포 아키텍처를 채택

### 📦 Core Infrastructure
- **Monorepo:** Turborepo
- **Package Manager:** pnpm
- **Linter & Formatter:** Biome (단일 진실 공급원으로 최상위 제어)
- **Deployment:** Railway (Web, API, Worker, DB, Redis 통합 배포)

### 💻 Apps (Applications)
| App | Tech Stack | Description |
| :--- | :--- | :--- |
| **`web`** | Next.js, Zustand, Tanstack-Query | FSD(Feature-Sliced Design) 아키텍처 기반 프론트엔드. 실제 사용자용 플랫폼 및 채팅 앱. `@briefly/ui` 공유 컴포넌트 사용. |
| **`admin`** | Next.js, Zustand, Tanstack-Query | FSD(Feature-Sliced Design) 아키텍처 기반 프론트엔드. 내부 운영용 어드민 대시보드. `@briefly/ui` 공유 컴포넌트 사용. |
| **`api`** | NestJS, Socket.io, better-auth | 메인 HTTP API 및 실시간 상태(Stateful)를 관리하는 웹소켓 게이트웨이. 단일 포트로 통합 운영. |
| **`worker`** | Hono (Node.js), BullMQ | 무거운 AI 요약 작업을 비동기로 처리하는 독립된 Stateless 백그라운드 워커. |

### 🛠️ Packages (Shared)
| Package | Tech Stack | Description |
| :--- | :--- | :--- |
| **`@briefly/ui`** | shadcn/ui, Tailwind CSS v4, React 19 | 모노레포 전체에서 공유하는 UI 컴포넌트 라이브러리. shadcn(base-mira 스타일)으로 관리. |
| **`@briefly/db`** | PostgreSQL, Drizzle ORM | 모노레포 내 단일 진실 공급원(SSOT)으로 작동하는 DB 스키마 & 클라이언트. |
| **`@briefly/redis`** | ioredis, BullMQ | API와 Worker 간의 오타 방지 및 타입 안정성을 위한 공유 Redis 클라이언트, Queue 이름, Job Payload 타입 정의. |
| **`@briefly/auth`** | Better Auth | 모노레포 전체에서 공유하는 인증 설정 중앙화 패키지. Auth 인스턴스, 클라이언트, 커스텀 플러그인을 제공. |
| **`@briefly/typescript-config`** | TypeScript | 프로젝트 전체의 타입 일관성을 유지하는 공통 Base 설정. |

### 🔗 External Services
- **AI Engine:** Google Gemini API (대화 컨텍스트 주입 방식, RAG 미사용)
- **Message Queue:** Redis (BullMQ 기반 작업 대기열 및 토큰 레이트 리밋 제어)
- **Object Storage:** Cloudflare R2 (Pre-signed URL 방식을 통한 서버 부하 없는 첨부파일 업로드/다운로드)

---

## 📂 Project Structure

```text
briefly-monorepo/
├── apps/
│   ├── web/           # Next.js 프론트엔드 (UI & Client Socket)
│   ├── admin/         # Next.js 어드민 대시보드 (내부 운영용)
│   ├── api/           # NestJS 메인 서버 (Auth, R2 서명, Socket Broadcast)
│   └── worker/        # Hono 워커 (BullMQ Consumer, Gemini API 호출)
│
├── packages/
│   ├── ui/            # 공유 UI 컴포넌트 라이브러리 (shadcn/ui, Tailwind CSS v4)
│   ├── db/            # Drizzle ORM 스키마 (apps/api와 apps/worker에서 공유)
│   ├── auth/          # Better Auth 인증 설정 중앙화 (config, client, plugin)
│   ├── redis/         # Redis 클라이언트 및 BullMQ 타입/상수 공유
│   └── typescript-config/ # 공통 TS 설정
│
├── biome.json         # 모노레포 전역 코드 스타일 & 린트 룰
└── pnpm-workspace.yaml