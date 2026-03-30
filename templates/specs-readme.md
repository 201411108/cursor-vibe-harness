# Project Specs (Single Source of Truth)

이 폴더는 프로젝트 기획의 **Single Source of Truth**입니다.
모든 기능 기획, 변경 이력, 의사결정 기록을 이곳에서 관리합니다.

## 폴더 구조

```
.cursor/specs/
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

1. **새 기능 기획 시**: `features/`에 기획 문서를 작성한다
2. **기존 기능 수정 시**: `features/`의 기존 문서를 먼저 읽고, 변경분을 갱신한다
3. **코드 변경 완료 시**: `changes/`에 변경 기록을 남긴다
4. **중요 결정 시**: `decisions/`에 결정 배경과 근거를 기록한다
5. **문서 삭제 금지**: 더 이상 유효하지 않은 문서는 상단에 `[Deprecated]`를 표기한다
