# 패키지 구조 및 의존성 컨벤션

## 새 패키지 추가

새 공유 패키지는 `packages/` 아래에 생성한다. `/add-package` 스킬을 사용한다.

필수 구조:
```
packages/<name>/
├── src/
│   └── index.ts       # public API 엔트리포인트
├── package.json       # name: "@briefly/<name>"
├── tsconfig.json      # @briefly/typescript-config 확장
└── tsup.config.ts     # 빌드 설정
```

## 빌드 도구

빌드가 필요한 패키지는 `tsup`을 사용한다. ESM + CJS + DTS 모두 출력한다.

```ts
// tsup.config.ts
export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
});
```

서버/클라이언트 코드가 혼재하는 경우 엔트리포인트를 분리한다:
```ts
entry: ["src/index.ts", "src/client.ts"],
```

## tsconfig

```json
{
  "extends": "@briefly/typescript-config/base.json"
}
```

React 컴포넌트가 포함된 패키지:
```json
{
  "extends": "@briefly/typescript-config/react-library.json"
}
```

## 모노레포 내 참조

모노레포 내 패키지는 반드시 `workspace:*`로 참조한다.

```json
{
  "dependencies": {
    "@briefly/db": "workspace:*",
    "@briefly/auth": "workspace:*"
  }
}
```

## 환경변수

- 패키지 내부에서 `process.env`를 직접 읽지 않는다.
- 초기화 함수의 인자로 받거나, 소비하는 앱에서 설정한다.

```ts
// ❌
export const db = drizzle(process.env.DATABASE_URL!);

// ✅
export function createDb(connectionString: string) {
  return drizzle(connectionString);
}
```

## 서버 전용 코드

서버에서만 실행되어야 하는 파일은 최상단에 `import "server-only"` 를 추가한다.
(Next.js 환경 기준. Server Actions의 `"use server"`가 있는 파일은 불필요.)

```ts
import "server-only";

export async function getSecretData() { ... }
```
