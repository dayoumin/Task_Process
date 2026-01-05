# Playwright Test Agents - AI-Powered Testing

이 프로젝트는 **Playwright Test Agents**를 사용하여 AI가 자동으로 테스트를 생성, 실행, 수정합니다.

## 🤖 AI 코딩 시대의 자동화 테스트

**문제점:**
- AI가 코드를 작성 → 인간이 일일이 검토하기 어려움
- 수동 테스트 작성 → AI 코딩 워크플로우와 맞지 않음

**해결책:**
- **Planner Agent**: 앱을 탐색하고 포괄적인 테스트 계획 생성
- **Generator Agent**: Markdown 테스트 계획에서 실행 가능한 Playwright 테스트 자동 생성
- **Healer Agent**: DOM 변경 시 자동으로 locator 수정 및 self-healing

---

## 📁 프로젝트 구조

```
tests/
├── .claude/
│   └── agents/
│       ├── playwright-test-planner.md      # 테스트 계획 생성 에이전트
│       ├── playwright-test-generator.md    # 테스트 코드 생성 에이전트
│       └── playwright-test-healer.md       # 테스트 자동 수정 에이전트
├── .mcp.json                               # MCP 서버 설정
├── specs/
│   ├── README.md
│   ├── builder-app-tests.md               # Builder 앱 테스트 계획
│   ├── dashboard-app-tests.md             # Dashboard 앱 테스트 계획
│   └── executor-app-tests.md              # Executor 앱 테스트 계획
├── e2e/
│   ├── seed.spec.ts                        # 환경 설정 seed 테스트
│   └── (AI가 생성한 테스트 파일들)
└── playwright.config.ts                    # Playwright 설정
```

---

## 🚀 사용 방법

### 1. 테스트 계획 생성 (Planner Agent)

Claude Code CLI에서 Planner Agent를 사용하거나, 수동으로 Markdown 계획을 작성합니다.

**Claude Code에서 Planner 사용:**
- Planner Agent가 자동으로 앱을 탐색하고 테스트 계획 생성
- 사용자 플로우 분석
- Happy path, Edge case, Error handling 시나리오 포함
- `specs/` 디렉토리에 Markdown 저장

**수동으로 테스트 계획 작성:**
- `specs/` 디렉토리에 `.md` 파일 생성
- 기존 `builder-app-tests.md`, `dashboard-app-tests.md`, `executor-app-tests.md` 참고

### 2. 테스트 코드 생성 (Generator Agent)

Claude Code CLI에서 Generator Agent 사용:

Generator Agent가 자동으로:
1. `specs/` 디렉토리의 Markdown 계획 읽기
2. 실제 브라우저에서 각 단계 실행하며 selector 검증
3. 실행 가능한 Playwright 테스트 코드 생성
4. `e2e/` 디렉토리에 `.spec.ts` 파일 저장

**생성된 테스트 예시:**
```typescript
// spec: specs/builder-app-tests.md
// seed: e2e/seed.spec.ts

test.describe('Process Creation and Management', () => {
  test('Create New Process', async ({ page }) => {
    // 1. Navigate to the Process Builder app
    await page.goto('http://localhost:5173')

    // 2. Click on "새 프로세스" (New Process) button
    await page.click('button:has-text("새 프로세스")')

    // 3. Enter process name "테스트 프로세스 1"
    await page.fill('input[name="processName"]', '테스트 프로세스 1')

    // 4. Enter description
    await page.fill('textarea[name="description"]', 'AI가 자동 생성한 테스트 프로세스')

    // 5. Click "저장" (Save) button
    await page.click('button:has-text("저장")')

    // Expected: Process is created successfully
    await expect(page.locator('.success-notification')).toBeVisible()
  })
})
```

### 3. 테스트 실행

```bash
# 모든 테스트 실행
npx playwright test

# 특정 브라우저만
npx playwright test --project=chromium

# UI 모드 (디버깅)
npx playwright test --ui

# 특정 앱만 테스트
npx playwright test --grep="builder"
```

### 4. 테스트 자동 수정 (Healer Agent)

테스트가 실패하면 Claude Code CLI에서 Healer Agent 사용:

Healer Agent가 자동으로:
1. 실패한 테스트 분석
2. 현재 DOM과 예상 DOM 비교
3. 변경된 selector 자동 수정
4. 테스트 재실행 및 검증

---

## ⚙️ 설정

### 환경 변수

```bash
# .env 파일 생성
BUILDER_URL=http://localhost:5173
DASHBOARD_URL=http://localhost:5175
EXECUTOR_URL=http://localhost:5174

# CI 환경
CI=true
```

### 포트 설정

| 앱 | 포트 | URL |
|-----|------|-----|
| Builder | 5173 | http://localhost:5173 |
| Dashboard | 5175 | http://localhost:5175 |
| Executor | 5174 | http://localhost:5174 |

### Playwright 설정

[playwright.config.ts](playwright.config.ts)에서 설정:
- 병렬 실행 (`fullyParallel: true`)
- 재시도 (`retries: 2` in CI)
- 스크린샷 (`screenshot: 'only-on-failure'`)
- 3개 앱 자동 시작 (`webServer` 설정)

---

## 📝 테스트 계획 작성 가이드

### Markdown 포맷

```markdown
# App Name Test Plan

**Seed:** `e2e/seed.spec.ts`
**App URL:** http://localhost:5173

---

## 1. Feature Group Name

### 1.1 Test Scenario Name
**Steps:**
1. Navigate to the app
2. Click on button X
3. Enter data Y
4. Verify result Z

**Expected:**
- Result is displayed correctly
- Success notification appears
```

### 중요 포인트

1. **Seed 파일 명시**: AI가 환경 설정 코드를 재사용
2. **명확한 단계**: 구체적이고 실행 가능한 단계 작성
3. **검증 기준**: Expected 섹션에 명확한 검증 조건
4. **독립성**: 각 테스트는 독립적으로 실행 가능해야 함

---

## 🔄 CI/CD 통합

### GitHub Actions 예시

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Install dependencies
        run: pnpm install

      - name: Build apps
        run: pnpm build

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run tests
        run: npx playwright test
        env:
          CI: true

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 🎯 AI 워크플로우

### 1단계: AI가 코드 작성
```bash
# Claude Code가 새 기능 구현
Claude> 새로운 프로세스 생성 기능을 구현해주세요
```

### 2단계: AI가 테스트 계획 생성
```bash
# Planner Agent 실행 (Claude Code CLI)
# Planner가 새 기능을 탐색하고 테스트 계획 생성
# specs/new-feature-tests.md 생성됨
```

### 3단계: AI가 테스트 코드 생성
```bash
# Generator Agent 실행 (Claude Code CLI)
# Generator가 테스트 계획을 읽고 실제 브라우저에서 검증하며 코드 생성
# e2e/new-feature.spec.ts 생성됨
```

### 4단계: 테스트 자동 실행
```bash
npx playwright test

# 모든 테스트 자동 실행
# 실패한 테스트가 있으면 Healer Agent가 자동 수정 가능
```

### 5단계: Self-Healing
```bash
# 테스트 실패 시 Healer Agent 실행 (Claude Code CLI)
# Healer가 실패 원인 분석하고 locator 자동 수정
# 테스트 재실행 → 성공
```

---

## 🛠️ 디버깅

### UI 모드 사용

```bash
npx playwright test --ui
```

- 각 단계 시각적으로 확인
- 실패한 테스트 디버깅
- 스크린샷 및 비디오 확인

### 로그 확인

```bash
npx playwright test --debug
```

- 브라우저가 실제로 열림
- 각 단계 수동 진행 가능
- DevTools 자동 오픈

### Trace 뷰어

```bash
npx playwright show-trace trace.zip
```

- 테스트 실행 전체 타임라인
- 각 액션의 스크린샷
- 네트워크 요청 확인

---

## 📊 테스트 보고서

테스트 실행 후 자동으로 HTML 보고서 생성:

```bash
npx playwright show-report
```

보고서 내용:
- ✅ 통과한 테스트
- ❌ 실패한 테스트
- ⏱️ 실행 시간
- 📸 스크린샷 (실패 시)
- 🎥 비디오 (실패 시)

---

## 🔗 참고 문서

- [Playwright Test Agents 공식 문서](https://playwright.dev/docs/test-agents)
- [Playwright MCP 가이드](https://www.testleaf.com/blog/playwright-mcp-ai-test-automation-2026/)
- [Claude Code Integration](https://github.com/anthropics/claude-code)

---

## ❓ FAQ

### Q: 테스트 계획을 수동으로 작성해야 하나요?
A: 아니요. Planner Agent가 앱을 탐색하고 자동으로 생성할 수 있습니다. 하지만 수동으로 작성하면 더 정확한 테스트를 얻을 수 있습니다.

### Q: 기존 테스트 파일을 수정할 수 있나요?
A: 네. `e2e/` 디렉토리의 `.spec.ts` 파일을 직접 수정하거나, Healer Agent가 자동으로 수정하도록 할 수 있습니다.

### Q: CI/CD에서 어떻게 실행하나요?
A: GitHub Actions, GitLab CI, Jenkins 등 어디서나 `npx playwright test` 명령어로 실행 가능합니다.

### Q: 테스트가 자주 실패하면 어떻게 하나요?
A: Healer Agent를 실행하거나, `reuseExistingServer: true` 설정으로 서버 재시작 방지, 또는 `retries` 설정 증가.

### Q: 3개 앱을 동시에 테스트할 수 있나요?
A: 네. `playwright.config.ts`의 `webServer` 설정으로 3개 앱이 자동으로 시작되고 병렬로 테스트됩니다.

---

## 📋 기존 테스트 계획

이미 작성된 포괄적인 테스트 계획:

1. **[builder-app-tests.md](specs/builder-app-tests.md)** - Process Builder 앱
   - 프로세스 생성 및 관리
   - 추적 설정
   - 검증 로직
   - 내보내기/가져오기
   - 노드 설정
   - UI/UX 엣지 케이스
   - 에러 핸들링

2. **[dashboard-app-tests.md](specs/dashboard-app-tests.md)** - Dashboard 앱
   - 프로세스 진행 모니터링
   - 통계 및 분석
   - 파일 업로드
   - 실시간 업데이트
   - 내보내기 기능
   - 사용자 관리
   - 모바일 반응형
   - 성능 및 접근성

3. **[executor-app-tests.md](specs/executor-app-tests.md)** - Process Executor 앱
   - 프로세스 실행 플로우
   - 폼 검증
   - 일시정지/재개
   - 활동 로그
   - 조건부 분기
   - 데이터 지속성
   - 다중 프로세스 실행
   - 알림 및 접근성

---

**작성일**: 2026-01-05
**버전**: 2.0.0
**Playwright Test Agents**: Enabled ✅
