#!/bin/bash
# PreToolUse hook — Bash 도구 실행 전 위험 명령 차단
# stdin으로 tool_input JSON을 받는다.

input=$(cat)
command=$(echo "$input" | jq -r '.tool_input.command // ""')

# 위험 패턴 목록
dangerous_patterns=(
  "rm -rf /"
  "rm -rf ~"
  "rm -rf \$HOME"
  "git push --force"
  "git push -f"
  "DROP TABLE"
  "DROP DATABASE"
  "truncate"
)

for pattern in "${dangerous_patterns[@]}"; do
  if echo "$command" | grep -qi "$pattern"; then
    echo "{\"hookSpecificOutput\": {\"hookEventName\": \"PreToolUse\", \"permissionDecision\": \"deny\", \"permissionDecisionReason\": \"위험한 명령이 감지되었습니다: '$pattern'. 직접 실행이 필요하면 사용자에게 확인을 요청하세요.\"}}"
    exit 0
  fi
done

exit 0
