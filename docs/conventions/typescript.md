# TypeScript 컨벤션

## type vs interface

`type`을 기본으로 사용한다. `interface`는 선언 병합(declaration merging)이 명시적으로 필요한 경우에만 허용한다.

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

## 타입 export

패키지 public API의 타입은 반드시 `export type`으로 명시적으로 re-export한다.

```ts
// packages/auth/src/index.ts
export type { Session, User } from "./types";
```

## 엄격한 설정

- `strict: true` 항상 활성화.
- `noUncheckedIndexedAccess: true` 권장.
- `tsconfig.json`은 `@briefly/typescript-config/base.json` 또는 `react-library.json`을 확장한다.

## 네이밍

- 타입/인터페이스: `PascalCase`
- 변수/함수: `camelCase`
- 상수: `SCREAMING_SNAKE_CASE` (환경변수, 매직 넘버)
- 파일: `kebab-case.ts`

## 함수 스타일

- 순수 함수를 우선한다.
- 사이드이펙트가 있는 함수는 명시적으로 분리한다.
- 화살표 함수와 일반 함수 선언 모두 허용하나, 모듈 최상위 함수는 `function` 선언 선호.

## 오류 처리

`try-catch` 구문 대신 `@briefly/utils`의 `tryCatch` / `tryCatchSync`를 사용한다.
판별 유니온(`Result<T, E>`) 타입으로 성공/실패를 명시적으로 구분한다.

```ts
// ❌
try {
  const data = await fetchUser(id);
  return data;
} catch (error) {
  console.error(error);
}

// ✅
import { tryCatch } from '@briefly/utils';

const { data, error, isSuccess } = await tryCatch(() => fetchUser(id));
if (!isSuccess) {
  console.error(error);
  return;
}
// 이 시점에서 data는 타입이 보장됨
```

동기 코드는 `tryCatchSync`를 사용한다.

```ts
import { tryCatchSync } from '@briefly/utils';

const { data, error, isSuccess } = tryCatchSync(() => JSON.parse(raw));
```

## 금지 패턴

- `any` 사용 금지. 불가피한 경우 `unknown` 후 타입 가드 사용.
- `as` 타입 단언 최소화. 필요 시 주석으로 이유 명시.
- `// @ts-ignore` 금지. `// @ts-expect-error` + 이유 주석만 허용.
- `try-catch` 구문 직접 사용 금지. `tryCatch` / `tryCatchSync` 사용.
