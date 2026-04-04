# Project Specs (Single Source of Truth)

이 폴더는 프로젝트 기획과 구현 이력의 Single Source of Truth입니다.
이 문서는 `{{TARGET_LABEL}}`용 specs 경로 `{{SPECS_PATH}}`에 생성되었습니다.

## 폴더 구조

```text
{{SPECS_PATH}}/
├── README.md          ← 이 파일 (관리 가이드 + 인덱스)
├── features/          ← 기능별 기획 문서
├── changes/           ← 변경 이력
└── decisions/         ← 의사결정 기록 (ADR)
```

## 문서 유형

### features/

기능별 기획 문서. 기획자(role-planner)가 작성하고, 디자이너/개발자가 참조한다.
유지보수 시 해당 기능 문서를 갱신하여 최신 상태를 유지한다.

- 파일명: `{feature-name}.md`
- 예시: `payment-retry.md`, `user-onboarding.md`

### changes/

기능 구현, 버그 수정, 리팩토링 등 코드 변경 시 기록.
개발자(role-developer)가 구현 완료 후 작성한다.

- 파일명: `{YYYY-MM-DD}-{title}.md`
- 예시: `2026-03-30-payment-retry-implementation.md`

### decisions/

아키텍처, 디자인, 기술 선택 등 주요 의사결정을 기록 (ADR 패턴).
기획자, 디자이너, 개발자 모두 작성할 수 있다.

- 파일명: `{NNN}-{title}.md` (순번으로 관리)
- 예시: `001-state-management-library.md`

## 운영 규칙

1. 새 기능 기획 시 `features/`에 문서를 만든다
2. 기존 기능 수정 시 기존 feature 문서를 먼저 읽고 변경분만 갱신한다
3. 코드 변경 완료 시 `changes/`에 실제 구현과 검증 결과를 남긴다
4. 중요한 제품/디자인/기술 결정은 `decisions/`에 기록한다
5. 문서가 없더라도 워크플로는 degraded mode로 동작할 수 있다
6. 문서를 삭제하기보다 상단에 `[Deprecated]`를 표시한다

## 예시 문서

`agent-workflow-orchestration init --target {{TARGET_NAME}}`은 예시 문서를 함께 생성한다.

- `features/_example-feature.md`
- `changes/_example-change.md`
- `decisions/000-example-decision.md`
