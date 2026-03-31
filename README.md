# Cursor Agent Harness

[![npm version](https://img.shields.io/npm/v/%40hankim.dev%2Fcursor-vibe-harness.svg)](https://www.npmjs.com/package/@hankim.dev/cursor-vibe-harness)

Cursor에서 멀티 역할 에이전트 시스템을 구축하는 스킬 세트입니다.

사용자의 요청을 분석하여 **기획자**, **디자이너**, **개발자** 역할에 순차적으로 위임하고, 각 역할의 산출물을 다음 역할에 전달하여 최적의 결과를 만듭니다.

## 아키텍처

```
사용자 입력
    ↓
오케스트레이터 (작업 분석 + 역할 선정)
    ↓
기획자 → 디자이너 → 개발자
  (필요한 역할만 순차 실행)
    ↓
.cursor/specs/ (SSoT 문서 관리)
  기획 → 결정 → 변경 이력 기록
```

## 포함된 역할

| 역할               | 설명                                                              |
| ------------------ | ----------------------------------------------------------------- |
| **오케스트레이터** | 작업 유형을 분석하고 필요한 역할을 선정하여 순차 호출             |
| **기획자**         | 요구사항 구조화, 엣지 케이스 분석, 웹 서칭으로 레퍼런스 조사      |
| **디자이너**       | UI/UX 휴리스틱 평가, 피그마 분석, 디자인 개선 제안                |
| **개발자**         | 코드베이스 패턴 활용, 요구사항 + 엣지 케이스를 만족하는 코드 작성 |

## 작업 유형별 파이프라인

| 요청 유형      | 활성 역할                  |
| -------------- | -------------------------- |
| 신규 기능 개발 | 기획자 → 디자이너 → 개발자 |
| UI/UX 개선     | 디자이너 → 개발자          |
| 버그 수정      | 개발자                     |
| 기획 검토      | 기획자                     |
| 리팩토링       | 개발자                     |
| 디자인 리뷰    | 디자이너                   |

## 설치

### 프로젝트 설치 (기본값)

```bash
cd /path/to/your-project
npx @hankim.dev/cursor-vibe-harness install
```

현재 프로젝트의 `.cursor/skills/`에 설치됩니다. 이 프로젝트를 열었을 때만 적용됩니다.

### 전역 설치 (모든 프로젝트에 적용)

```bash
npx @hankim.dev/cursor-vibe-harness install --global
```

`~/.cursor/skills/`에 설치되어 모든 프로젝트에서 자동으로 사용 가능합니다.

### npm global

```bash
npm install -g @hankim.dev/cursor-vibe-harness
cursor-vibe-harness install             # 프로젝트 설치
cursor-vibe-harness install --global    # 전역 설치
```

### git clone

```bash
git clone https://github.com/201411108/cursor-vibe-harness.git
cd cursor-vibe-harness
bash install.sh
```

### 강제 재설치

```bash
npx @hankim.dev/cursor-vibe-harness install --force
npx @hankim.dev/cursor-vibe-harness install --global --force
```

### 설치 상태 확인

```bash
npx @hankim.dev/cursor-vibe-harness list
```

전역과 현재 프로젝트 양쪽의 설치 상태를 모두 보여줍니다.

### 제거

```bash
npx @hankim.dev/cursor-vibe-harness uninstall            # 프로젝트에서 제거
npx @hankim.dev/cursor-vibe-harness uninstall --global   # 전역에서 제거
```

## 기획 문서 관리 (Single Source of Truth)

하네스는 `.cursor/specs/` 폴더를 프로젝트 기획의 **Single Source of Truth**로 활용합니다. 기능 기획, 변경 이력, 의사결정 기록을 한 곳에서 관리하여 지속적인 기능 개선과 유지보수를 지원합니다.

### Specs 폴더 초기화

```bash
cd /path/to/your-project
npx @hankim.dev/cursor-vibe-harness init
```

아래 구조가 생성됩니다:

```
.cursor/specs/
├── README.md          # 문서 관리 가이드 + 인덱스
├── features/          # 기능별 기획 문서
├── changes/           # 변경 이력
└── decisions/         # 의사결정 기록 (ADR)
```

### 문서 유형

| 폴더         | 용도                | 파일명 규칙               | 작성 주체              |
| ------------ | ------------------- | ------------------------- | ---------------------- |
| `features/`  | 기능별 기획서       | `{feature-name}.md`       | 기획자                 |
| `changes/`   | 변경 이력 기록      | `{YYYY-MM-DD}-{title}.md` | 개발자                 |
| `decisions/` | 의사결정 기록 (ADR) | `{NNN}-{title}.md`        | 기획자/디자이너/개발자 |

### 문서 관리 흐름

각 역할이 작업할 때 자동으로 문서를 참조하고 기록합니다:

1. **작업 시작 시**: 기존 기획 문서를 탐색하여 컨텍스트 확보
2. **기획 완료 시**: `features/`에 기획 문서 저장/갱신
3. **디자인 완료 시**: `decisions/`에 디자인 결정 기록
4. **개발 완료 시**: `changes/`에 변경 이력 기록, `features/` 문서 갱신
5. **유지보수 시**: 기존 문서를 읽고 변경분만 반영

### 템플릿

`init` 실행 시 specs 폴더에 관리 가이드가 함께 생성됩니다. 패키지에 포함된 템플릿을 참고하여 문서를 작성할 수 있습니다:

- `feature-template.md` - 기능 기획서 템플릿
- `change-template.md` - 변경 기록 템플릿
- `decision-template.md` - 의사결정 기록 (ADR) 템플릿

## 사용 예시

### 전체 파이프라인 (기획자 → 디자이너 → 개발자)

```
결제 실패 시 자동 재시도 기능을 추가하고 싶어.
- 최대 3회까지 재시도
- 재시도 중 진행 상태 표시
- 3회 실패 시 고객센터 연결 안내
```

### 디자이너 → 개발자

```
이 바텀시트의 UX를 개선해줘.
추천 아이템을 강조하고 할인율 표시를 더 눈에 띄게 만들고 싶어.
```

### 기획자 단독

```
현재 결제 플로우 전체를 분석해줘.
엣지 케이스들과 다른 앱들의 레퍼런스도 같이 찾아줘.
```

### 개발자 단독

```
이 파일에서 any 타입을 정확한 타입으로 바꿔줘.
```

## 커스터마이즈

각 역할의 동작을 수정하려면 설치 경로의 SKILL.md를 직접 편집하면 됩니다.

| 역할           | 프로젝트 설치 경로                             | 전역 설치 경로                                   |
| -------------- | ---------------------------------------------- | ------------------------------------------------ |
| 오케스트레이터 | `.cursor/skills/orchestrator-harness/SKILL.md` | `~/.cursor/skills/orchestrator-harness/SKILL.md` |
| 기획자         | `.cursor/skills/role-planner/SKILL.md`         | `~/.cursor/skills/role-planner/SKILL.md`         |
| 디자이너       | `.cursor/skills/role-designer/SKILL.md`        | `~/.cursor/skills/role-designer/SKILL.md`        |
| 개발자         | `.cursor/skills/role-developer/SKILL.md`       | `~/.cursor/skills/role-developer/SKILL.md`       |

## 배포

### npm 배포 체크리스트

1. `npm login`으로 npm 계정 인증
2. `package.json`의 `version`을 [semver](https://semver.org/)에 맞게 업데이트
3. `CHANGELOG.md`에 변경 내역 기록
4. `npm publish` 실행 (`publishConfig.access=public` 기준)
5. GitHub에 태그/릴리스 생성: `git tag v{version} && git push --tags`

### 버전 규칙

- **Major** (x.0.0): 호환성이 깨지는 스킬 구조 변경
- **Minor** (0.x.0): 새 역할 추가, 기존 스킬에 기능 추가
- **Patch** (0.0.x): 프롬프트 개선, 버그 수정, 문서 보완

## 요구사항

- [Cursor](https://cursor.com/) IDE
- Agent 모드 사용 (스킬 자동 인식에 필요)
- Node.js >= 14.0.0 (CLI 사용 시)

## License

MIT
