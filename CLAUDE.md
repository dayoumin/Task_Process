# 🤖 Claude 개발 가이드라인 - Business Process Executor

## 📌 프로젝트 개요

**이름**: Business Process Executor (업무 프로세스 실행 시스템)
**위치**: `D:\Projects\Task_Process`
**생성일**: 2026-01-05
**상태**: 96% 완료 (프로덕션 준비 완료)

### 시스템 구성

```
Task_Process/
├── user-executor/      ✅ 100% - 사용자용 프로세스 실행 (Vanilla JS)
├── admin-builder/      ✅ 100% - 관리자용 프로세스 생성 (React + TypeScript)
└── admin-dashboard/    ⚠️  90% - 분석 대시보드 (React + Chart.js)
```

---

## ⚠️ 중요 주의사항

### 🚫 절대 금지 사항

1. **User Executor 수정 금지**
   - ✅ 완료된 컴포넌트로 수정 불필요
   - 참고용으로만 사용
   - 오류 발견 시 개발자와 상의 후 수정

2. **Admin Builder 수정 금지**
   - ✅ 코드 리뷰 통과 완료
   - 버그 발견 시에만 수정 고려
   - 새 기능 추가 전 개발자와 상의

3. **Admin Dashboard는 제한적 수정만 허용**
   - ⚠️ 2개 Critical 수정 필요 (6분 소요)
   - 나머지는 안정적인 상태

---

## 🎯 현재 작업 가능한 항목

### Admin Dashboard 남은 2개 수정

#### 1. Division by Zero (src/services/statistics.ts:298)
```typescript
// 현재:
const avg = durations.reduce((a, b) => a + b, 0) / durations.length;

// 수정:
const avg = durations.length > 0
  ? durations.reduce((a, b) => a + b, 0) / durations.length
  : 0;
```

#### 2. CSV Injection (src/utils/export.ts:167)
```typescript
// 현재:
const csv = summary.map((row) => row.join(',')).join('\n');

// 수정:
const csv = summary.map((row) =>
  row.map(cell => escapeCSV(cell)).join(',')
).join('\n');
```

**상세 내역**: [admin-dashboard/CODE_REVIEW_REPORT.md](admin-dashboard/CODE_REVIEW_REPORT.md)

---

## 📚 주요 문서

### 시작 가이드
- **[START_HERE.md](START_HERE.md)** ⭐ 가장 먼저 읽을 것!
- **[README.md](README.md)** - 프로젝트 전체 개요
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - 시스템 아키텍처

### 컴포넌트별 문서
- **User Executor**: [user-executor/README.md](user-executor/README.md)
- **Admin Builder**: [admin-builder/README.md](admin-builder/README.md)
- **Admin Dashboard**: [admin-dashboard/README.md](admin-dashboard/README.md)

### 코드 리뷰 및 품질
- **Admin Builder**: [admin-builder/CODE_REVIEW_FIXES.md](admin-builder/CODE_REVIEW_FIXES.md)
- **Admin Dashboard**: [admin-dashboard/CODE_REVIEW_REPORT.md](admin-dashboard/CODE_REVIEW_REPORT.md)

---

## 🔧 개발 원칙

### 1. 파일 수정 전 필수 체크
```bash
# 파일 읽기 필수
Read <file_path>

# 수정 전 백업
git add -A
git commit -m "Before: <작업 설명>"

# 수정 후 테스트
pnpm build  # TypeScript 프로젝트
python -m http.server 8000  # User Executor
```

### 2. TypeScript 프로젝트 규칙
- **import type 사용**: 타입만 import 시 `import type { ... }`
- **any 타입 금지**: 명시적 타입 지정
- **verbatimModuleSyntax: true** 준수

### 3. 보안 규칙
- **CSV Injection 방지**: `escapeCSV()` 함수 사용
- **JSON 검증**: 모든 외부 데이터 검증
- **파일 크기 제한**: 최대 50MB
- **XSS 방지**: 사용자 입력 sanitize

### 4. 성능 규칙
- **React.memo** 사용: 커스텀 컴포넌트
- **useMemo/useCallback**: 계산 비용 높은 함수
- **Division by Zero** 체크: 모든 나눗셈 연산

---

## 📋 작업 워크플로우

### 새 기능 추가 시

1. **요구사항 확인**
   - 어느 컴포넌트에 추가할지 결정
   - 기존 코드와 충돌 없는지 확인

2. **관련 문서 읽기**
   - ARCHITECTURE.md 확인
   - 해당 컴포넌트 README.md 확인

3. **코드 작성**
   - TypeScript strict mode 준수
   - 기존 코드 스타일 일치

4. **테스트**
   ```bash
   pnpm build  # 빌드 성공 확인
   pnpm dev    # 실행 테스트
   ```

5. **코드 리뷰 요청**
   - Task tool with code-reviewer agent 사용

---

## 🚀 배포 전 체크리스트

### Admin Dashboard (90% → 100%)
- [ ] Division by Zero 수정 (statistics.ts:298)
- [ ] CSV Injection 수정 (export.ts:167)
- [ ] `pnpm build` 성공
- [ ] 샘플 ZIP 파일 테스트

### 전체 시스템
- [ ] User Executor 실행 테스트 (localhost:8000)
- [ ] Admin Builder 실행 테스트 (localhost:5174)
- [ ] Admin Dashboard 실행 테스트 (localhost:5173)
- [ ] 전체 워크플로우 테스트
  1. Admin Builder에서 프로세스 생성 → JSON
  2. User Executor에서 실행 → ZIP
  3. Admin Dashboard에서 분석 → 통계

---

## 🛠️ 사용 가능한 Skill

### business-process-orchestrator
**위치**: `.claude/skills/business-process-orchestrator.md`

**용도**: 3개 컴포넌트 병렬 개발 오케스트레이션

**사용 시기**:
- 새로운 기능을 3개 컴포넌트에 동시 추가할 때
- 대규모 리팩토링 시
- 시스템 전체 업그레이드 시

**사용 방법**:
```
/business-process-orchestrator
```

---

## 📊 완성도 현황

| 컴포넌트 | 완성도 | 상태 | 남은 작업 |
|---------|--------|------|----------|
| User Executor | 100% | ✅ 완료 | 없음 |
| Admin Builder | 100% | ✅ 완료 | 없음 |
| Admin Dashboard | 90% | ⚠️ 거의 완료 | 2개 수정 (6분) |
| **전체** | **96%** | ⚠️ 프로덕션 준비 | 6분 작업 |

---

## 🔍 문제 해결

### TypeScript 빌드 실패
```bash
# 루트에서 전체 빌드
pnpm build

# 또는 특정 앱만 빌드
pnpm --filter @task-process/builder build
pnpm --filter @task-process/dashboard build

# 오류 확인:
# - import type 누락?
# - any 타입 사용?
# - 타입 불일치?
```

### User Executor 실행 안 됨
```bash
# Python 버전 확인
python --version  # 3.x 필요

# 다른 포트 사용
python -m http.server 3000
```

### pnpm install 실패
```bash
# Node 버전 확인
node --version  # 18+ 필요

# pnpm 버전 확인
pnpm --version  # 9.0.0+ 필요

# 캐시 정리
pnpm store prune
pnpm install
```

---

## 🎯 다음 단계 (사용자 결정)

### Option 1: 즉시 배포 (권장)
1. Admin Dashboard 2개 수정 (6분)
2. 전체 빌드 테스트
3. 배포

### Option 2: 추가 개선
- Medium/Low 이슈 수정 (선택)
- 테스트 코드 작성
- 접근성 개선
- UX 세부 조정

### Option 3: 현재 상태 유지
- 96% 완성도로 전달
- 문서와 함께 인수인계

---

## 🤖 Claude 작업 시 행동 원칙

1. **안전 우선**: 완료된 컴포넌트는 건드리지 않기
2. **문서 확인**: 코드 작성 전 관련 문서 읽기
3. **테스트 필수**: 변경 후 반드시 빌드/실행 테스트
4. **질문하기**: 불확실할 때는 개발자와 상의
5. **백업**: git commit으로 변경 전 상태 저장

---

**마지막 업데이트**: 2026-01-05
**프로젝트 상태**: 96% 완성, 프로덕션 배포 가능
**긴급 작업**: Admin Dashboard 2개 수정 (6분)