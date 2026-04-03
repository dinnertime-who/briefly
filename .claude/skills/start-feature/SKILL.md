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

feature 브랜치를 생성한다. 브랜치 전략은 `docs/conventions/git.md`를 따른다.

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
