# Git 컨벤션

## 브랜치 전략

```
main
 └── develop
       └── feature/<kebab-case-title>
```

- `main`: 프로덕션 배포 브랜치. 사람만 병합 가능.
- `develop`: 통합 브랜치. feature/* 브랜치가 완료되면 여기로 PR을 생성한다.
- `feature/*`: 기능 구현 단위 브랜치. 반드시 `develop`에서 분기한다.

## 기능 구현 흐름

1. `develop` 최신화 후 `feature/<name>` 브랜치 생성 (`/start-feature` 스킬 사용)
2. 기능 구현 및 커밋
3. `develop`을 향한 PR 생성
4. 사람이 검토 후 `develop`에 병합
5. `develop` → `main` 병합은 사람이 직접 수행

## 브랜치 네이밍

- `feature/` 접두사 필수
- kebab-case 사용
- 명확한 기능 단위로 네이밍

```
feature/user-auth
feature/briefing-creation
feature/email-notification
```

## 커밋 메시지

```
<type>: <요약>

<본문 (선택)>
```

| type | 용도 |
|------|------|
| `feat` | 새 기능 |
| `fix` | 버그 수정 |
| `chore` | 빌드, 설정, 의존성 |
| `refactor` | 리팩터링 |
| `docs` | 문서 |
| `test` | 테스트 |

## 금지 사항

- `main`, `develop`에 직접 push 금지 (훅으로 차단됨)
- `main`에 직접 커밋 금지
- force push 금지
