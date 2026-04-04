---
name: role-orchestrator
description: >-
  멀티 역할 워크플로의 오케스트레이터. 사용자 요청을 분류하고
  planner/designer/developer 역할의 실행 순서와 컨텍스트 전달 형식을 고정한다.
inputs:
  required:
    - user_request
  optional:
    - project_context
    - specs_context
    - attached_urls
outputs:
  required:
    - task_classification
    - active_roles
    - role_handoff_blocks
    - final_summary
required_tools:
  - file_read
optional_tools:
  - glob_search
  - text_search
fallbacks:
  - specs 폴더가 없으면 문서 기반 컨텍스트 없이 진행하고 init 명령만 안내한다.
  - 특정 역할 스킬을 찾지 못하면 해당 역할을 생략하지 말고 사용자에게 제한사항을 명시한다.
---

# Role: Orchestrator

이 스킬은 실행 엔진이 아니라 역할 체인 계약을 고정하는 orchestration 레이어다.  
항상 아래 출력 계약과 순서를 유지한다.

## Inputs

### Required

- `user_request`: 사용자의 원문 요청

### Optional

- `project_context`: 현재 프로젝트의 스택, 구조, 제약
- `specs_context`: target-specific specs 디렉터리에서 읽은 기존 문서 요약
- `attached_urls`: 피그마, 이슈, 문서 링크

## Outputs

반드시 아래 4개 블록을 순서대로 만든다.

1. `task_classification`
2. `active_roles`
3. `role_handoff_blocks`
4. `final_summary`

### Output Contract

```markdown
## 작업 분석 결과

### task_classification
- 요청 유형: [feature | ui_improvement | bugfix | refactor | planning | design_review | mixed]
- 근거: [1-2줄]

### active_roles
- 순서: [role-planner -> role-designer -> role-developer]
- 제외된 역할: [없으면 "없음"]

### role_handoff_blocks
#### role-planner
- 목표:
- 반드시 다뤄야 할 리스크:
- 다음 역할 입력:

#### role-designer
- 목표:
- 반드시 다뤄야 할 리스크:
- 다음 역할 입력:

#### role-developer
- 목표:
- 반드시 다뤄야 할 리스크:
- 다음 역할 입력:

### final_summary
- 완료된 분석:
- 아직 미해결인 점:
- specs 기록 여부:
```

## Routing Rules

| 요청 유형 | 활성 역할 |
|-----------|-----------|
| 신규 기능 | `role-planner -> role-designer -> role-developer` |
| UI/UX 개선 | `role-designer -> role-developer` |
| 버그 수정 | `role-developer` |
| 리팩토링 | `role-developer` |
| 기획 검토 | `role-planner` |
| 디자인 리뷰 | `role-designer` |
| 복합 요청 | `role-planner -> role-designer -> role-developer` |

아래 조건이면 역할을 추가한다:

- 요구사항이 모호함: `role-planner`
- UI 변경 또는 피그마 링크 포함: `role-designer`
- 코드 변경 필요: `role-developer`

## Execution Rules

1. 먼저 target-specific specs의 `features/`, `decisions/`가 있으면 읽고 요약한다.
2. 스킬 실행 전에 사용자에게 작업 분류와 활성 역할을 간결히 선언한다.
3. 각 역할 실행 결과는 다음 역할의 입력으로 압축 전달한다.
4. 역할 산출물은 장문 전체를 그대로 넘기지 말고 핵심 결정과 리스크만 넘긴다.
5. 최종 응답에는 무엇이 실제로 확인된 사실인지와 추론인지 구분한다.

## Fallback Rules

- `glob_search`가 없으면 직접 경로를 확인하고 파일 목록을 수동 탐색한다.
- 관련 specs 문서가 없으면 `specs_context`를 비워두고 계속 진행한다.
- 역할 스킬을 열 수 없으면 그 사실을 노출하고 일반 추론 모드로 작업하되, 해당 역할 산출물은 "degraded"로 표시한다.
- 단순 질문, 파일 읽기, 사소한 단일 수정은 이 스킬을 건너뛴다.
