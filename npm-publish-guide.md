# npm 배포 과정 가이드

## 1. 패키지 작성자 (본인) 쪽

**`npm publish` 실행 시 일어나는 일:**

1. npm CLI가 `package.json`을 읽어 패키지 메타데이터(이름, 버전, 설명 등)를 파악한다
2. `files` 필드(또는 `.npmignore`)를 기준으로 **배포에 포함할 파일만** tarball(`.tgz`)로 압축한다
   - 이 프로젝트의 경우 `bin/`, `skills/`, `templates/`, `README.md`, `LICENSE`만 포함
   - `install.sh`, `uninstall.sh` 같은 건 제외
3. 이 tarball을 **npm registry** (`https://registry.npmjs.org`)에 HTTP PUT 요청으로 업로드한다
4. registry가 패키지명 + 버전 중복 여부를 확인하고, 문제없으면 저장한다

## 2. npm registry 쪽

registry에 저장되는 것:

- **tarball 파일**: 실제 코드가 담긴 압축 파일
- **메타데이터**: `package.json` 내용, 모든 버전 목록, dist-tags(`latest`, `next` 등), 다운로드 URL, 체크섬(integrity hash)

`https://registry.npmjs.org/@hankim.dev%2Fagent-workflow-orchestration` 같은 URL로 접근하면 이 메타데이터를 JSON으로 볼 수 있다.

## 3. 사용자 (유저) 쪽

### `npx @hankim.dev/agent-workflow-orchestration install` 실행 시

```
npx @hankim.dev/agent-workflow-orchestration install
     │
     ▼
① registry에 "@hankim.dev/agent-workflow-orchestration" 최신 버전 조회
     │
     ▼
② tarball 다운로드 + 임시 디렉터리에 압축 해제
     │
     ▼
③ package.json의 "bin" 필드 확인
   → "agent-workflow-orchestration": "./bin/cli.js" 발견
     │
     ▼
④ bin/cli.js를 실행하면서 뒤에 붙은 인자("install") 전달
     │
     ▼
⑤ cli.js가 skills/ 폴더를 .cursor/skills/로 복사
```

### `npm install -g @hankim.dev/agent-workflow-orchestration` 실행 시

```
npm install -g @hankim.dev/agent-workflow-orchestration
     │
     ▼
① registry에서 tarball 다운로드
     │
     ▼
② 글로벌 node_modules에 압축 해제
   (보통 /usr/local/lib/node_modules/ 또는 ~/.npm-global/)
     │
     ▼
③ "bin" 필드를 보고 심볼릭 링크 생성
   /usr/local/bin/agent-workflow-orchestration → .../bin/cli.js
     │
     ▼
④ 이후 터미널 어디서든 agent-workflow-orchestration 명령어 사용 가능
```

## npx vs npm install -g 차이

| | `npx` | `npm install -g` |
|---|---|---|
| 설치 위치 | 임시 캐시 (자동 정리) | 글로벌 node_modules |
| 디스크 상주 | 실행 후 캐시에만 남음 | 영구 설치 |
| 항상 최신 | 매번 최신 버전 확인 | 설치 시점 버전 고정 |
| 사용 방식 | `npx @hankim.dev/agent-workflow-orchestration ...` | `agent-workflow-orchestration ...` |

## 버전 관리가 중요한 이유

npm registry는 **한번 올린 버전을 덮어쓸 수 없다.** `1.0.0`을 올린 뒤 실수를 발견하면 `1.0.1`로 새 버전을 올려야 한다. `npm unpublish`로 72시간 이내에 삭제는 가능하지만, 같은 버전 번호를 재사용할 수는 없다.

그래서 `CHANGELOG.md`를 관리하고, semver를 따르는 것이 중요하다.

## 실제 배포 명령어 순서

```bash
# 1. npm 계정 인증 (최초 1회)
npm login

# 2. 배포
npm publish

# 3. 확인
npm info @hankim.dev/agent-workflow-orchestration
```

이 3줄이면 전 세계 누구나 `npx @hankim.dev/agent-workflow-orchestration install`로 사용할 수 있게 된다.
