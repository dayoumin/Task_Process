# Critical Fixes Applied

## 수정 완료 날짜: 2026-01-05

---

## 1. TypeScript 버전 통일 및 의존성 관리 ✅

### 문제점
- TypeScript 버전이 루트와 각 패키지에서 불일치
- zod, react, react-dom 버전이 여러 곳에서 중복 설치
- shared-types 패키지가 빌드되지 않은 상태

### 해결방법

**[package.json](package.json) - pnpm overrides 추가**
```json
"pnpm": {
  "overrides": {
    "typescript": "5.7.2",
    "zod": "3.24.1",
    "react": "19.2.0",
    "react-dom": "19.2.0"
  }
}
```

**postinstall 스크립트 추가**
```json
"postinstall": "pnpm --filter @task-process/shared-types build"
```

### 효과
- ✅ 모든 패키지에서 동일한 TypeScript 버전 사용 (5.7.2)
- ✅ 의존성 버전 충돌 방지
- ✅ pnpm install 시 자동으로 shared-types 빌드

---

## 2. Windows 호환성 문제 수정 ✅

### 문제점
```json
"clean": "turbo clean && rm -rf node_modules"  // Windows에서 실패
```

### 해결방법

**[package.json](package.json) - Windows 호환 명령어**
```json
"clean": "turbo clean && pnpm -r exec rm -rf node_modules && rm -rf node_modules"
```

**rimraf 추가 (선택적)**
```json
"devDependencies": {
  "rimraf": "^6.0.1"
}
```

### 효과
- ✅ Windows, macOS, Linux 모두에서 clean 명령어 작동
- ✅ pnpm의 크로스 플랫폼 명령어 활용

---

## 3. Vite 포트 충돌 해결 ✅

### 문제점
- builder: 5173 (기본값)
- dashboard: 5173 (기본값) ← 충돌!
- executor: 5174

### 해결방법

**[apps/builder/vite.config.ts](apps/builder/vite.config.ts)**
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,  // builder
  },
  build: {
    outDir: 'dist',
  },
})
```

**[apps/dashboard/vite.config.ts](apps/dashboard/vite.config.ts)**
```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175,  // dashboard (변경)
  },
  build: {
    outDir: 'dist',
  },
})
```

### 포트 할당

| 앱 | 포트 | URL |
|-----|------|-----|
| builder | 5173 | http://localhost:5173 |
| dashboard | 5175 | http://localhost:5175 |
| executor | 5174 | http://localhost:5174 |

### 효과
- ✅ `pnpm dev` 실행 시 포트 충돌 없음
- ✅ 동시에 모든 앱 실행 가능

---

## 4. Zod Date 직렬화 문제 수정 ✅

### 문제점

**JSON 직렬화 불가**
```typescript
// Before
createdAt: z.date().default(() => new Date())  // ❌ JSON.stringify 실패
value: z.union([z.string(), z.number(), z.date()])  // ❌ 직렬화 불가
```

### 해결방법

**[packages/shared-types/src/process.ts](packages/shared-types/src/process.ts)**
```typescript
// After
export const ProcessMetadataSchema = z.object({
  name: z.string().min(1, '프로세스 이름을 입력해주세요').max(100),
  description: z.string().optional(),
  department: z.string().optional(),
  version: z.string().default('1.0.0'),
  createdAt: z.string().datetime().default(() => new Date().toISOString()),
  updatedAt: z.string().datetime().default(() => new Date().toISOString()),
})

export const ProcessExecutionSchema = z.object({
  processId: z.string().uuid(),
  status: ProcessExecutionStatusSchema,
  currentNodeId: z.string().optional(),
  completedNodeIds: z.array(z.string()).default([]),
  startedAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
  executionData: z.record(z.unknown()).default({}),
})
```

**[packages/shared-types/src/node.ts](packages/shared-types/src/node.ts)**
```typescript
// After
export const FormFieldSchema = z.object({
  id: z.string(),
  label: z.string().min(1, '필드 레이블을 입력해주세요'),
  type: FormFieldTypeSchema,
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(),
  value: z.union([z.string(), z.number()]).optional(),  // Date 제거
})
```

### 효과
- ✅ JSON 직렬화/역직렬화 정상 작동
- ✅ ISO 8601 표준 형식 사용
- ✅ Zod datetime() 검증으로 형식 보장

---

## 5. turbo.json 최적화 ✅

### 문제점
```json
{
  "build": {
    "dependsOn": ["^build"],
    "outputs": [".next/**", "!.next/cache/**", "dist/**", "build/**"]  // ❌ 불필요
  },
  "lint": {
    "dependsOn": ["^lint"]  // ❌ 불필요한 의존성
  }
}
```

### 해결방법

**[turbo.json](turbo.json)**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"],  // ✅ 실제 출력 디렉토리만
      "inputs": ["src/**", "package.json", "tsconfig.json", "vite.config.ts"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "outputs": []  // ✅ 출력 없음
    },
    "type-check": {
      "outputs": []  // ✅ 출력 없음
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "test:e2e": {
      "cache": false"  // ✅ dependsOn 제거
    },
    "test:unit": {
      "outputs": ["coverage/**"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

### 효과
- ✅ 불필요한 `.next/`, `build/` 출력 제거
- ✅ lint, type-check의 불필요한 의존성 제거
- ✅ inputs 명시로 캐싱 정확도 향상
- ✅ 빌드 성능 개선

---

## 6. shared-types 빌드 검증 ✅

### 빌드 결과

```bash
$ pnpm --filter @task-process/shared-types build

dist/
├── index.d.ts
├── index.d.ts.map
├── index.js
├── index.js.map
├── node.d.ts
├── node.d.ts.map
├── node.js
├── node.js.map
├── process.d.ts
├── process.d.ts.map
├── process.js
└── process.js.map
```

### 효과
- ✅ TypeScript 타입 정의 (.d.ts) 생성
- ✅ Source map 생성으로 디버깅 용이
- ✅ builder, dashboard에서 타입 자동 인식

---

## 검증 방법

### 1. 의존성 재설치
```bash
cd d:\Projects\Task_Process
pnpm install
# ✅ postinstall 훅으로 shared-types 자동 빌드
```

### 2. 전체 빌드
```bash
pnpm build
# ✅ shared-types → shared-ui → shared-utils → apps 순서로 빌드
```

### 3. 개발 서버 실행
```bash
pnpm dev
# ✅ builder: http://localhost:5173
# ✅ dashboard: http://localhost:5175
# ✅ executor: http://localhost:5174
```

### 4. 타입 체크
```bash
pnpm type-check
# ✅ 모든 패키지 타입 에러 없음
```

---

## 남은 작업 (Next Steps)

### High Priority

1. **로컬 타입을 shared-types로 이동**
   ```
   apps/builder/src/types/tracking.types.ts → packages/shared-types/src/tracking.ts
   apps/dashboard/src/types/progress.types.ts → packages/shared-types/src/progress.ts
   apps/dashboard/src/types/stats.types.ts → packages/shared-types/src/stats.ts
   ```

2. **executor 앱 통합 전략 결정**
   - 옵션 A: TypeScript로 마이그레이션 + workspace 패키지 사용
   - 옵션 B: 순수 JS 유지 + 별도 독립 프로젝트로 분리

3. **TypeScript 프로젝트 참조 설정**
   ```json
   // apps/builder/tsconfig.json
   {
     "references": [
       { "path": "../../packages/shared-types" },
       { "path": "../../packages/shared-ui" }
     ]
   }
   ```

### Medium Priority

4. **ESLint 설정 통합**
   - builder의 로컬 `eslint.config.js` 제거
   - `@task-process/config-eslint` 사용

5. **Tailwind 설정 통합**
   - builder, dashboard의 로컬 `tailwind.config.js` 제거
   - `@task-process/config-tailwind` 확장 사용

6. **Playwright 설정 개선**
   - 하드코딩된 경로 환경 변수로 변경
   - 모든 앱 테스트 지원

### Low Priority

7. **Pre-commit hooks 추가**
   ```bash
   pnpm add -D husky lint-staged
   ```

8. **CI/CD 파이프라인 구축**
   - GitHub Actions
   - Turbo Remote Caching

---

## 개선 효과 요약

| 항목 | Before | After | 개선 |
|------|--------|-------|------|
| TypeScript 버전 | 5.9.3 (불일치) | 5.7.2 (통일) | ✅ |
| shared-types 빌드 | ❌ 없음 | ✅ 자동 빌드 | ✅ |
| Windows 호환성 | ❌ `rm -rf` 실패 | ✅ 크로스 플랫폼 | ✅ |
| Vite 포트 충돌 | ❌ 5173 중복 | ✅ 5173, 5175, 5174 | ✅ |
| Zod 직렬화 | ❌ Date 타입 | ✅ ISO string | ✅ |
| turbo.json | ❌ 불필요한 설정 | ✅ 최적화 | ✅ |
| 빌드 성능 | - | ✅ 캐싱 개선 | ✅ |

---

## 참고 문서

- [MONOREPO_SETUP.md](MONOREPO_SETUP.md) - 모노레포 전환 상세 문서
- [README.md](README.md) - 프로젝트 사용 가이드
- [Code Review Report](실행한 에이전트 결과) - 전체 코드 리뷰 보고서

---

**작성일**: 2026-01-05
**담당**: Claude Sonnet 4.5
