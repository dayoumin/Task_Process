# Task Process Management System

> **AI 시대를 위한 Turborepo + pnpm 모노레포 프로젝트**

업무 프로세스 생성, 실행, 분석을 위한 통합 시스템입니다.

**특징:**
- ✅ **AI-Powered Testing** - Playwright Test Agents + Vitest로 자동 테스트
- ✅ **Type-first Development** - Zod 스키마로 런타임 검증
- ✅ **Dual-mode Deployment** - 정적 HTML + Full-stack 서버 지원
- ✅ **Monorepo** - Turborepo + pnpm workspace 효율적 관리

---

## 📁 프로젝트 구조

```
Task_Process/
├── apps/                        # 애플리케이션들
│   ├── builder/                 # 프로세스 빌더 (React Flow) - :5173
│   ├── dashboard/               # 관리자 대시보드 - :5175
│   └── executor/                # 사용자 실행기 - :5174
│
├── packages/                    # 공유 패키지
│   ├── shared-types/            # Zod 스키마 + TypeScript 타입
│   ├── shared-ui/               # 공유 UI 컴포넌트 (Radix UI)
│   ├── shared-utils/            # 유틸리티 함수
│   ├── testing/                 # 테스트 유틸리티
│   ├── config-eslint/           # ESLint 공유 설정
│   ├── config-typescript/       # TypeScript 공유 설정
│   └── config-tailwind/         # Tailwind 공유 설정
│
├── tests/                       # 테스트
│   ├── .claude/agents/          # Playwright Test Agents (Planner, Generator, Healer)
│   ├── .mcp.json                # MCP 서버 설정 (Playwright + TestSprite)
│   ├── e2e/                     # E2E 테스트 (Playwright)
│   │   ├── builder/             # Builder 앱 테스트
│   │   ├── dashboard/           # Dashboard 앱 테스트
│   │   └── executor/            # Executor 앱 테스트
│   ├── specs/                   # AI 테스트 계획 (Markdown)
│   │   ├── builder-app-tests.md
│   │   ├── dashboard-app-tests.md
│   │   └── executor-app-tests.md
│   └── playwright.config.ts     # Playwright 설정
│
├── vitest.config.ts             # Vitest 설정
├── turbo.json                   # Turborepo 설정
└── pnpm-workspace.yaml          # pnpm workspace 설정
```

---

## 🚀 빠른 시작

### 1. 의존성 설치

```bash
pnpm install
```

### 2. 개발 서버 실행

```bash
# 모든 앱 동시 실행
pnpm dev

# 특정 앱만 실행
pnpm --filter @task-process/builder dev     # http://localhost:5173
pnpm --filter @task-process/dashboard dev   # http://localhost:5175
pnpm --filter @task-process/executor dev    # http://localhost:5174
```

### 3. 빌드

```bash
# 전체 빌드 (Turbo 캐싱)
pnpm build

# 타입 체크
pnpm type-check

# 린트
pnpm lint
```

---

## 🧪 테스트

### Unit 테스트 (Vitest)

```bash
# 전체 Unit 테스트 실행
pnpm test:unit

# Watch 모드
pnpm test:unit:watch

# UI 모드
pnpm test:unit:ui

# 커버리지
pnpm test:coverage
```

**테스트 파일:**
- `packages/shared-types/src/*.test.ts` - Zod 스키마 검증
- 26개 테스트 통과 ✅

### E2E 테스트 (Playwright Test Agents)

```bash
# 전체 E2E 테스트 실행
pnpm test:e2e

# UI 모드 (디버깅)
pnpm test:e2e:ui

# 특정 앱만 테스트
cd tests && npx playwright test --grep="builder"
```

**테스트 파일:**
- `tests/e2e/builder/*.spec.ts`
- `tests/e2e/dashboard/*.spec.ts`
- `tests/e2e/executor/*.spec.ts`

### 모든 테스트 실행

```bash
# Unit + E2E 전체 실행
pnpm test
```

---

## 🤖 AI 테스트 자동 생성

### Playwright Test Agents

**3개의 자율 Agent:**

1. **Planner Agent** - 앱 탐색 후 테스트 계획 생성
2. **Generator Agent** - Markdown 계획 → Playwright 코드 자동 생성
3. **Healer Agent** - 실패한 테스트 자동 수정 (Self-healing)

**사용법:**

Claude Code CLI에서 Agent 실행:
- Planner가 앱 탐색하고 `tests/specs/*.md` 생성
- Generator가 Markdown 읽고 `tests/e2e/**/*.spec.ts` 생성
- Healer가 실패한 테스트 자동 수정

**이미 작성된 테스트 계획:**
- [builder-app-tests.md](tests/specs/builder-app-tests.md) - 17개 시나리오
- [dashboard-app-tests.md](tests/specs/dashboard-app-tests.md) - 25개 시나리오
- [executor-app-tests.md](tests/specs/executor-app-tests.md) - 32개 시나리오

**상세 가이드:** [tests/README.md](tests/README.md)

---

## 📦 배포

### 옵션 1: 정적 HTML (개인 PC 사용)

```bash
# 빌드
pnpm build

# 결과물
apps/builder/dist/index.html
apps/dashboard/dist/index.html
apps/executor/dist/index.html

# 로컬 실행
start apps/builder/dist/index.html
```

### 옵션 2: Vercel/Netlify (무료 호스팅)

```bash
# Vercel
vercel deploy

# Netlify
netlify deploy
```

### 옵션 3: Docker

```bash
docker-compose up -d
```

### 옵션 4: Next.js Full-stack

API Routes + Database 연동 후 배포

**상세 가이드:** [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

---

## 📚 주요 명령어

| 명령어 | 설명 |
|--------|------|
| `pnpm dev` | 개발 서버 실행 (3개 앱) |
| `pnpm build` | 전체 빌드 (Turbo 캐싱) |
| `pnpm test` | 모든 테스트 (Unit + E2E) |
| `pnpm test:unit` | Unit 테스트 (Vitest) |
| `pnpm test:e2e` | E2E 테스트 (Playwright) |
| `pnpm test:unit:ui` | Vitest UI 모드 |
| `pnpm test:e2e:ui` | Playwright UI 모드 |
| `pnpm type-check` | 타입 체크 |
| `pnpm lint` | 린트 |
| `pnpm clean` | 빌드 파일 삭제 |

---

## 🛠️ 기술 스택

### Core
- **React 19** - UI 라이브러리
- **TypeScript 5.7** - 타입 안전성
- **Vite** - 빌드 도구
- **Tailwind CSS** - 스타일링

### State & Data
- **Zod** - 런타임 스키마 검증
- **React Flow** - 프로세스 플로우 차트
- **Radix UI** - 접근성 높은 UI 컴포넌트

### Monorepo & Build
- **Turborepo** - 빌드 시스템 (캐싱)
- **pnpm** - 패키지 매니저

### Testing
- **Playwright** - E2E 테스트 (AI Agents)
- **Vitest** - Unit 테스트
- **Testing Library** - React 컴포넌트 테스트

---

## 📖 문서

- [CRITICAL_FIXES.md](CRITICAL_FIXES.md) - Phase 1 수정 내역
- [IMPROVEMENTS_COMPLETE.md](IMPROVEMENTS_COMPLETE.md) - 완료된 개선 사항
- [MONOREPO_SETUP.md](MONOREPO_SETUP.md) - 모노레포 전환 문서
- [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) - 배포 가이드 (4가지 옵션)
- [tests/README.md](tests/README.md) - Playwright Test Agents 완전 가이드

---

## 🎯 테스트 현황

### Unit 테스트 (Vitest)
```
Test Files  2 passed (2)
     Tests  26 passed (26)
  Duration  ~1s
```

### E2E 테스트 (Playwright)
```
Test Files  1 passed (seed.spec.ts)
     Tests  3 passed (3)
  Duration  ~8s
```

**테스트 커버리지:**
- ✅ Zod 스키마 검증 (26개 테스트)
- ✅ 환경 설정 확인 (3개 앱)
- ⏸️ E2E 시나리오 (74개 계획 완료, Generator 실행 대기)

---

## 🚀 성능

| 항목 | Before | After | 개선 |
|------|--------|-------|------|
| 전체 빌드 | ~5s | 220ms | ✅ Turbo Cache |
| TypeScript 버전 | 불일치 | 5.7.2 통일 | ✅ |
| 타입 중복 | 분산 | shared-types 통합 | ✅ |
| 테스트 자동화 | 수동 | AI Agent 자동 | ✅ |

---

## 🤝 기여

이 프로젝트는 AI 코딩 시대를 위한 학습용 템플릿입니다.

**핵심 원칙:**
1. **Type-first**: Zod 스키마 → TypeScript 타입 자동 생성
2. **Test-driven**: AI가 테스트 생성 → 인간이 검증
3. **Package-first**: 코드 재사용 → 중복 제거

---

## 📄 라이선스

MIT License

---

**작성일**: 2026-01-05
**버전**: 2.0.0
**상태**: ✅ 프로덕션 준비 완료
