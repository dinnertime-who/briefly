---
name: start-feature
description: >
  새 기능 구현을 시작할 때 자동으로 사용한다.
  "~~ 만들어줘", "~~ 구현해줘", "~~ 기능 추가해줘" 등 새 작업 요청이 오면
  현재 브랜치가 feature/*가 아닌 경우 코드 작성 전에 항상 이 스킬을 먼저 실행한다.
user-invocable: true
arguments:
  - name: feature-name
    description: 기능 이름 (kebab-case, 예 "user-auth", "briefing-creation")
    required: true
---

feature 브랜치를 생성한다.

## 규칙

### 브랜치 전략

```
main
 └── develop
       └── feature/<kebab-case-title>
```

- `main`: 프로덕션 배포 브랜치. 사람만 병합 가능.
- `develop`: 통합 브랜치. feature/* 브랜치가 완료되면 여기로 PR을 생성한다.
- `feature/*`: 기능 구현 단위 브랜치. 반드시 `develop`에서 분기한다.

### 브랜치 네이밍

- `feature/` 접두사 필수
- kebab-case 사용
- 명확한 기능 단위로 네이밍

예시: `feature/user-auth`, `feature/briefing-creation`, `feature/email-notification`

### 커밋 메시지

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

### 금지 사항

- `main`, `develop`에 직접 push 금지 (훅으로 차단됨)
- `main`에 직접 커밋 금지
- force push 금지

**실행 순서:**

1. 현재 작업 중인 변경사항이 있는지 확인 (`git status`)
   - 미커밋 변경사항이 있으면 중단하고 사용자에게 알린다

2. develop 브랜치로 이동 후 최신화
   ```sh
   git checkout develop
   git pull origin develop
   ```

3. feature 브랜치 생성 및 이동
   ```sh
   git checkout -b feature/$ARGUMENTS
   ```

4. 완료 메시지 출력
   - 현재 브랜치 이름 확인
   - 작업 시작 안내 (구현 완료 후 develop으로 PR 생성)

---

## PR 생성 규칙

기능 구현이 완료되고 사용자가 PR 생성을 요청하면 아래 절차를 따른다.

### 실행 순서

1. 변경사항 확인
   ```sh
   git status
   git diff develop...HEAD
   git log develop..HEAD --oneline
   ```

2. 원격 브랜치에 push
   ```sh
   git push -u origin feature/<name>
   ```

3. PR 생성 (`develop` 대상)
   ```sh
   gh pr create --base develop --title "<제목>" --body "$(cat <<'EOF'
   ## 개요
   <!-- 변경 내용 요약 (1~3줄) -->

   ## 변경 사항
   <!-- 주요 변경 내용을 bullet으로 -->

   ## 테스트 체크리스트
   - [ ] 로컬 빌드 통과
   - [ ] 주요 기능 동작 확인

   🤖 Generated with [Claude Code](https://claude.com/claude-code)
   EOF
   )"
   ```

### PR 제목 규칙

- 커밋 타입 prefix 사용: `feat:`, `fix:`, `chore:` 등
- 70자 이내
- 한국어 요약

예시: `feat: 이메일 인증 기능 추가`, `chore: 의존성 패키지 업데이트`

### 주의 사항

- base 브랜치는 반드시 `develop` (절대 `main` 아님)
- force push 금지
- PR 생성 후 URL을 사용자에게 출력한다
