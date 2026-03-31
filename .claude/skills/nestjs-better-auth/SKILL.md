---
name: nestjs-better-auth
description: >
  Integrate Better Auth into a NestJS application using @thallesp/nestjs-better-auth.
  Use this skill whenever the user wants to add authentication to a NestJS app with Better Auth,
  set up auth guards, protect routes, use session decorators, implement role-based or
  permission-based access control, add auth hooks with DI, or configure AuthModule.
  Also trigger this skill when the user mentions @thallesp/nestjs-better-auth, NestJS auth guard,
  @Session decorator, @AllowAnonymous, @Roles, @OrgRoles, AuthService in NestJS, or any combination
  of NestJS + Better Auth. Don't wait for the user to say "nestjs-better-auth" explicitly — if
  they're working in apps/api and asking about auth setup, this skill is almost certainly what they need.
user-invocable: true
---

# NestJS Better Auth Integration

Uses **`@thallesp/nestjs-better-auth`** (requires `better-auth >= 1.5.0`).

---

## 1. Installation

```bash
pnpm add @thallesp/nestjs-better-auth
# in apps/api
```

---

## 2. Setup

### `apps/api/src/main.ts`

```ts
const app = await NestFactory.create(AppModule, {
  bodyParser: false, // 필수 — AuthModule이 body parser를 직접 등록함
});
```

> **중요:** `bodyParser: false` 없이는 Better Auth가 raw body를 읽을 수 없습니다.
> `NestFactory.create()`의 `rawBody: true`는 여기서 동작하지 않습니다.
> raw body가 필요하면 `AuthModule.forRoot()`의 `bodyParser.rawBody` 옵션을 사용하세요.

### `apps/api/src/app.module.ts`

```ts
import { AuthModule } from "@thallesp/nestjs-better-auth"
import { auth } from "./auth"

@Module({
  imports: [
    AuthModule.forRoot({
      auth,
      bodyParser: {
        json: { limit: "2mb" },
        urlencoded: { limit: "2mb", extended: true },
        rawBody: true, // req.rawBody 필요 시 (웹훅 등)
      },
    }),
  ],
})
export class AppModule {}
```

### `apps/api/src/auth.ts`

```ts
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { db } from "@briefly/db"

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg" }),
  trustedOrigins: [
    process.env.WEB_URL ?? "http://localhost:3000",
    process.env.ADMIN_URL ?? "http://localhost:3001",
  ],
  emailAndPassword: { enabled: true },
  hooks: {}, // @Hook 데코레이터 사용 시 필수
})
```

---

## 3. Decorators

### `@Session()` — 현재 세션 주입

```ts
import { Session, UserSession } from "@thallesp/nestjs-better-auth"

@Get("me")
async getProfile(@Session() session: UserSession) {
  return session
}
```

### `@AllowAnonymous()` / `@OptionalAuth()`

AuthGuard는 기본적으로 **모든 라우트를 보호**합니다. 예외를 두려면:

```ts
@AllowAnonymous() // 비인증 허용
@Get("public")
async publicRoute() {}

@OptionalAuth() // 인증 선택적 (session이 null일 수 있음)
@Get("maybe-auth")
async optionalRoute(@Session() session: UserSession | null) {}
```

클래스에 붙이면 컨트롤러 전체에 적용됩니다.

### `@Roles()` — 시스템 레벨 역할 (admin 플러그인)

```ts
import { Roles } from "@thallesp/nestjs-better-auth"

@Roles(["admin"])
@Get("dashboard")
async adminOnly() {}
```

- `user.role` 필드만 검사합니다
- 조직 admin은 우회 불가 (의도적 설계 — 권한 에스컬레이션 방지)

### `@OrgRoles()` — 조직 레벨 역할 (organization 플러그인)

```ts
import { OrgRoles } from "@thallesp/nestjs-better-auth"

@OrgRoles(["owner", "admin"])
@Get("settings")
async orgSettings() {}
```

- 세션에 `activeOrganizationId`가 있어야 동작합니다
- 시스템 admin도 조직 컨텍스트 없이는 접근 불가

### `@UserHasPermission()` — 시스템 권한

admin 플러그인의 access control을 사용합니다.

```ts
import { UserHasPermission } from "@thallesp/nestjs-better-auth"

@UserHasPermission({ permission: { project: ["create", "update"] } })
@Post()
async createProject() {}

// 여러 리소스 동시 검사
@UserHasPermission({ permissions: { project: ["delete"], sale: ["read"] } })
@Delete(":id")
async deleteProject() {}
```

`auth.ts`에서 access control 설정이 필요합니다:
```ts
import { admin } from "better-auth/plugins/admin"
import { createAccessControl } from "better-auth/plugins/access"

const statement = { project: ["create", "update", "delete"] } as const
const ac = createAccessControl(statement)
const editor = ac.newRole({ project: ["create", "update"] })

export const auth = betterAuth({
  plugins: [admin({ ac, roles: { editor } })],
})
```

### `@MemberHasPermission()` — 조직 멤버 권한

organization 플러그인의 access control을 사용합니다.

```ts
@MemberHasPermission({ permissions: { project: ["create"] } })
@Post()
async createOrgProject() {}
```

---

## 4. AuthService

Better Auth 인스턴스와 API에 직접 접근:

```ts
import { AuthService } from "@thallesp/nestjs-better-auth"
import { fromNodeHeaders } from "better-auth/node"
import { auth } from "../auth"

@Controller("users")
export class UsersController {
  constructor(private authService: AuthService<typeof auth>) {}

  @Get("accounts")
  async getAccounts(@Request() req: ExpressRequest) {
    return this.authService.api.listUserAccounts({
      headers: fromNodeHeaders(req.headers),
    })
  }
}
```

플러그인이 추가한 메서드(ex. `createApiKey`)에 타입 안전하게 접근하려면 `AuthService<typeof auth>` 제네릭을 사용하세요.

---

## 5. Hook 데코레이터 (DI 연동)

NestJS DI와 통합된 Better Auth 훅:

```ts
import { Hook, BeforeHook, AfterHook, AuthHookContext } from "@thallesp/nestjs-better-auth"

@Hook()
@Injectable()
export class SignUpHook {
  constructor(private readonly myService: MyService) {}

  @BeforeHook("/sign-up/email")
  async beforeSignUp(ctx: AuthHookContext) {
    // 유효성 검사, 차단 등
  }

  @AfterHook("/sign-up/email")
  async afterSignUp(ctx: AuthHookContext) {
    // 가입 후 처리 (환영 이메일 등)
  }
}
```

`app.module.ts`의 `providers`에 훅 클래스를 등록하세요.
**`auth.ts`에 `hooks: {}`가 반드시 있어야 합니다.**

---

## 6. Module Options 전체 목록

| 옵션 | 기본값 | 설명 |
|------|--------|------|
| `auth` | 필수 | Better Auth 인스턴스 |
| `bodyParser` | JSON + URLEncoded 재등록 | body parser 설정 (`json`, `urlencoded`, `rawBody`) |
| `disableGlobalAuthGuard` | `false` | `true`면 가드를 수동으로 등록해야 함 |
| `disableControllers` | `false` | `true`면 auth 라우트 컨트롤러를 직접 관리 |
| `disableTrustedOriginsCors` | `false` | `true`면 CORS를 수동 관리 |
| `middleware` | `undefined` | Better Auth 핸들러를 감싸는 미들웨어 (MikroORM RequestContext 등) |

### 글로벌 가드 비활성화 예시

```ts
AuthModule.forRoot({ auth, disableGlobalAuthGuard: true })

// 이후 컨트롤러에 직접 적용
@UseGuards(AuthGuard)
@Controller("protected")
export class ProtectedController {}
```

---

## 7. 주의사항

- **Fastify** 사용 시 `trustedOrigins` CORS가 자동 적용됨. 직접 관리하려면 `disableTrustedOriginsCors: true`
- `@Roles()`와 `@OrgRoles()`는 **의도적으로 분리**되어 있음 (권한 에스컬레이션 방지)
- GraphQL resolver, WebSocket gateway에도 동일한 데코레이터 패턴 사용 가능
- WebSocket은 `@UseGuards(AuthGuard)`를 Gateway 또는 Message 레벨에 직접 붙여야 함
