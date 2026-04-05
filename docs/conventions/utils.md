# @briefly/utils 컨벤션

## 개요

`packages/utils`는 앱/패키지 전반에서 재사용되는 순수 유틸리티 함수 모음이다.
패키지명은 `@briefly/utils`이며, `src/index.ts` 하나만 public API로 export한다.

## 디렉터리 구조

유틸 하나를 추가할 때마다 `src/` 아래에 기능 단위 폴더를 생성하고,
해당 폴더의 `index.ts`에서 구현을 export한다.

```
packages/utils/
└── src/
    ├── index.ts              # 각 유틸 폴더를 re-export
    ├── format-date/
    │   └── index.ts
    ├── truncate/
    │   └── index.ts
    └── sleep/
        └── index.ts
```

## index.ts 구성

`src/index.ts`는 각 유틸 폴더를 re-export하는 역할만 한다.

```ts
// src/index.ts
export * from './format-date';
export * from './truncate';
export * from './sleep';
```

유틸 폴더의 `index.ts`는 구현과 타입을 export한다.

```ts
// src/format-date/index.ts
export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
```

## 새 유틸 추가 절차

1. `src/<util-name>/` 폴더 생성
2. `src/<util-name>/index.ts`에 구현 작성
3. `src/index.ts`에 `export * from './<util-name>'` 추가

구현이 복잡해지면 유틸 폴더 안에 하위 폴더와 파일을 자유롭게 생성한다.
`index.ts`는 외부에 공개할 것만 export하고, 내부 구현은 외부로 노출하지 않는다.

```
src/format-date/
├── index.ts           # public export
├── format-date.ts     # 핵심 구현
└── helpers/
    └── pad.ts         # 내부 헬퍼
```

## 규칙

- 유틸 함수는 순수 함수(pure function)로 작성한다. 사이드 이펙트 금지.
- 외부 의존성은 최소화한다. Node.js 내장 모듈 또는 의존성 없이 구현 가능한 것만 포함한다.
- 앱/패키지 특화 로직은 포함하지 않는다. (DB, Auth, Email 등은 각 패키지에서 처리)
- 폴더명과 함수명은 kebab-case / camelCase를 각각 따른다.
