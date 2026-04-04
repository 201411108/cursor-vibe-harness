# Agent Workflow Orchestration

[![npm version](https://img.shields.io/npm/v/%40hankim.dev%2Fagent-workflow-orchestration.svg)](https://www.npmjs.com/package/@hankim.dev/agent-workflow-orchestration)

Cursor, Codex, Claude에서 역할 기반 작업 방식을 일관되게 설치하고 운영하기 위한 멀티 타깃 패키지입니다.

이 레포는 실행 엔진을 제공하지 않습니다. 대신 다음을 제공합니다:

- 플랫폼 중립 역할 계약
- 역할 체인과 출력 키를 고정한 [`agent-workflow.manifest.json`](/Users/hankim/Desktop/workspace/cursor-vibe-harness/agent-workflow.manifest.json)
- 타깃별 어댑터와 설치용 CLI
- 타깃별 SSoT 문서 초기화 템플릿
- active target 상태를 기록하는 `.agent-workflow/state.json`

즉, 이 패키지는 특정 에이전트 앱의 런타임이 아니라, 역할 기반 워크플로를 각 환경에 맞는 파일 구조로 배치하는 orchestration layer입니다.

## Targets

| Target | Skills Path | Specs Path | Role File |
|--------|-------------|------------|-----------|
| `cursor` | `.cursor/skills/` | `.cursor/specs/` | `SKILL.md` |
| `codex` | `.codex/skills/` | `.codex/specs/` | `AGENT.md` |
| `claude` | `.claude/skills/` | `.claude/specs/` | `CLAUDE.md` |

프로젝트당 active target은 하나만 허용합니다. 현재 활성 타깃은 `.agent-workflow/state.json`에 기록됩니다.

## 설치

```bash
npx @hankim.dev/agent-workflow-orchestration install --target cursor
npx @hankim.dev/agent-workflow-orchestration install --target codex
npx @hankim.dev/agent-workflow-orchestration install --target claude
```

기본값은 `--target cursor`입니다.  
다른 타깃이 이미 active target이면 `--force` 없이는 전환되지 않습니다.

전역 설치도 가능합니다.

```bash
npx @hankim.dev/agent-workflow-orchestration install --target cursor --global
```

## 초기화되는 프로젝트 구조

### `--target cursor`

```text
your-project/
├── .cursor/
│   ├── skills/
│   │   ├── role-orchestrator/SKILL.md
│   │   ├── role-planner/SKILL.md
│   │   ├── role-designer/SKILL.md
│   │   └── role-developer/SKILL.md
│   └── specs/
│       ├── README.md
│       ├── features/_example-feature.md
│       ├── changes/_example-change.md
│       └── decisions/000-example-decision.md
└── .agent-workflow/
    └── state.json
```

### `--target codex`

```text
your-project/
├── .codex/
│   ├── skills/
│   │   ├── role-orchestrator/AGENT.md
│   │   ├── role-planner/AGENT.md
│   │   ├── role-designer/AGENT.md
│   │   └── role-developer/AGENT.md
│   └── specs/
│       ├── README.md
│       ├── features/_example-feature.md
│       ├── changes/_example-change.md
│       └── decisions/000-example-decision.md
└── .agent-workflow/
    └── state.json
```

### `--target claude`

```text
your-project/
├── .claude/
│   ├── skills/
│   │   ├── role-orchestrator/CLAUDE.md
│   │   ├── role-planner/CLAUDE.md
│   │   ├── role-designer/CLAUDE.md
│   │   └── role-developer/CLAUDE.md
│   └── specs/
│       ├── README.md
│       ├── features/_example-feature.md
│       ├── changes/_example-change.md
│       └── decisions/000-example-decision.md
└── .agent-workflow/
    └── state.json
```

## CLI

```bash
agent-workflow-orchestration install --target cursor
agent-workflow-orchestration init --target codex
agent-workflow-orchestration doctor --target claude
agent-workflow-orchestration list
agent-workflow-orchestration validate
```

### `init`

선택된 타깃의 specs 경로에 예시 문서를 생성합니다.

```bash
npx @hankim.dev/agent-workflow-orchestration init --target cursor
npx @hankim.dev/agent-workflow-orchestration init --target codex
npx @hankim.dev/agent-workflow-orchestration init --target claude
```

### `doctor`

선택된 타깃 기준으로 아래를 점검합니다.

- 타깃별 skills 경로 존재 여부
- 타깃별 specs 경로 존재 여부
- active target 충돌 여부
- `package.json`의 `lint`, `test`, `typecheck` 스크립트 존재 여부

### `validate`

패키지 내부 정합성을 검사합니다.

- core 역할 계약
- 각 어댑터가 모든 타깃 파일을 렌더링 가능한지
- `agent-workflow.manifest.json`과 required output key 일치 여부
- 배포 파일 목록 정합성

## 역할 계약

역할의 공통 계약은 `agent-workflow.manifest.json`이 담당합니다.

- `requiredInputs`
- `requiredOutputs`
- `requiredTools`
- `optionalTools`

실제 파일 포맷은 타깃별 어댑터가 결정합니다.

## 상태 파일

`.agent-workflow/state.json`은 프로젝트의 active target과 설치된 타깃을 기록합니다.

예:

```json
{
  "activeTarget": "cursor",
  "installedTargets": ["cursor"],
  "packageVersion": "1.0.0"
}
```

이 파일 때문에 하나의 프로젝트에 여러 타깃을 병렬 운영하지 않고, 명시적으로 target을 전환하게 됩니다.

## 로컬 검증

```bash
npm run validate
npm run check:readme
npm run test:smoke
npm run check
```

`test:smoke`는 `cursor`, `codex`, `claude` 3개 타깃과 target conflict 시나리오를 함께 검사합니다.

## 오픈소스 기여 방법

기여는 작은 문서 수정부터 새 타깃 어댑터 추가까지 모두 가능합니다.

1. 이 저장소를 포크하고 작업 브랜치를 생성합니다.
2. 역할 계약을 바꾸는 경우 `agent-workflow.manifest.json`과 각 `skills/` 문서를 함께 수정합니다.
3. 타깃별 동작을 바꾸는 경우 `adapters/`, `bin/cli.js`, `templates/`, `scripts/fixture-smoke.js`를 함께 점검합니다.
4. 변경 후 최소 `npm run check`를 실행해 검증합니다.
5. README나 CLI 출력이 달라졌다면 사용 예시와 설명도 같이 업데이트합니다.
6. 변경 배경, 영향 범위, 검증 결과를 포함해 Pull Request를 보냅니다.

권장 PR 범위:

- 역할 계약 변경
- 특정 타깃 어댑터 변경
- 설치/초기화/검증 CLI 개선
- 문서와 예시 보강

## 요구사항

- Cursor, Codex, Claude 중 하나의 사용 환경
- Node.js >= 14.0.0

## License

MIT
