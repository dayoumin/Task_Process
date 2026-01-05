# business-process-orchestrator

업무 프로세스 실행 시스템(Business Process Executor) 전체 개발을 조율하는 오케스트레이션 Skill.

## 🎯 목적

3개 독립 컴포넌트를 병렬 개발하고 통합하여 완전한 시스템을 구축합니다.

## 🏗️ 시스템 구성

### 1. Admin Builder (관리자 빌더)
- **기술**: React 19 + TypeScript + React Flow + Zustand
- **예상 시간**: 12시간
- **경로**: `business-process-executor/admin-builder/`

### 2. User Executor (사용자 실행기)
- **기술**: Vanilla JavaScript + IndexedDB + JSZip
- **예상 시간**: 14시간
- **경로**: `business-process-executor/user-executor/`

### 3. Admin Dashboard (관리 대시보드)
- **기술**: React 19 + TypeScript + Chart.js
- **예상 시간**: 7시간
- **경로**: `business-process-executor/admin-dashboard/`

## 📋 작업 흐름

### Phase 1: 프로젝트 초기화 (병렬, 2시간)

**Task Agent 1 - Admin Builder 초기화**:
```bash
cd business-process-executor
npm create vite@latest admin-builder -- --template react-ts
cd admin-builder
npm install reactflow zustand lucide-react
npm install -D @types/node tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 폴더 구조 생성
mkdir -p src/{components/{nodes,sidebar,export},stores,services,types}
```

**Task Agent 2 - User Executor 초기화**:
```bash
cd business-process-executor/user-executor
# 폴더 구조 생성
mkdir -p css js vendor samples/{processes,vector-stores}
```

**Task Agent 3 - Admin Dashboard 초기화**:
```bash
cd business-process-executor
npm create vite@latest admin-dashboard -- --template react-ts
cd admin-dashboard
npm install chart.js react-chartjs-2 jszip
npm install -D @types/node tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

### Phase 2: 핵심 개발 (병렬, 20시간)

**Task Agent 1 - Admin Builder 개발** (12시간):

**작업 내용**:
1. ProcessBuilder 컴포넌트 (React Flow 캔버스)
2. 커스텀 노드 4종 (Start, Task, Condition, End)
3. TrackingSettings 컴포넌트 (추적 관리)
4. JSON 내보내기 (검증 포함)

**참고 문서**:
- `business-process-executor/ARCHITECTURE.md`
- `business-process-executor/docs/MVP_PLAN.md`

**산출물**:
```
admin-builder/src/
├── components/
│   ├── ProcessBuilder.tsx
│   ├── nodes/
│   │   ├── StartNode.tsx
│   │   ├── TaskNode.tsx
│   │   ├── ConditionNode.tsx
│   │   └── EndNode.tsx
│   ├── sidebar/
│   │   ├── NodePalette.tsx
│   │   └── TrackingSettings.tsx
│   └── export/
│       ├── ExportButton.tsx
│       └── PreviewModal.tsx
├── stores/
│   └── process-store.ts
├── services/
│   ├── export-service.ts
│   └── tracking-service.ts
└── types/
    ├── process.types.ts
    └── tracking.types.ts
```

---

**Task Agent 2 - User Executor 개발** (14시간):

**작업 내용**:
1. HTML/CSS UI (2-column + 챗봇 패널)
2. IndexedDB 5개 스토어 (processes, progresses, files, logs, notifications)
3. ProcessExecutor 클래스 (단계별 실행)
4. TrackingLogger 클래스 (진행 상황 추적)
5. 파일 처리 (Blob → ZIP)
6. LibreChat iframe 통합

**참고 문서**:
- `business-process-executor/ARCHITECTURE.md` (IndexedDB 스키마)
- `business-process-executor/docs/TRACKING_SYSTEM.md`

**산출물**:
```
user-executor/
├── index.html
├── start.bat
├── start.sh
├── css/
│   ├── main.css
│   ├── sidebar.css
│   ├── chatbot.css
│   └── tracking.css
├── js/
│   ├── app.js
│   ├── indexeddb.js
│   ├── process-executor.js
│   ├── file-handler.js
│   ├── chatbot.js
│   ├── tracking.js
│   └── ui.js
├── vendor/
│   └── jszip.min.js
└── samples/
    ├── processes/
    │   ├── onboarding.json
    │   ├── expense-report.json
    │   └── leave-request.json
    └── vector-stores/
        ├── onboarding-vector.json
        ├── expense-vector.json
        └── leave-vector.json
```

---

**Task Agent 3 - Admin Dashboard 개발** (7시간):

**작업 내용**:
1. ZIP 파일 업로드 및 파싱
2. 통계 계산 (부서별/업무별/개인별)
3. 병목 단계 분석
4. Chart.js 시각화
5. 월간 리포트 생성

**참고 문서**:
- `business-process-executor/docs/TRACKING_SYSTEM.md` (통계 로직)

**산출물**:
```
admin-dashboard/src/
├── components/
│   ├── Dashboard.tsx
│   ├── FileUpload.tsx
│   ├── StatsOverview.tsx
│   ├── DepartmentStats.tsx
│   ├── ProcessTypeChart.tsx
│   ├── BottleneckAnalysis.tsx
│   └── ReportGenerator.tsx
├── services/
│   ├── zip-parser.ts
│   ├── stats-calculator.ts
│   └── report-generator.ts
└── types/
    └── stats.types.ts
```

---

### Phase 3: 통합 및 검증 (순차, 3시간)

**Task Agent 4 - 통합 검증**:

**작업 내용**:
1. JSON 포맷 검증
   - Admin Builder 출력 → User Executor 입력
   - 필드 일치 확인
2. ZIP 포맷 검증
   - User Executor 출력 → Admin Dashboard 입력
   - 파일 구조 확인
3. 전체 플로우 테스트
   - 프로세스 생성 → 실행 → 분석

**산출물**:
- 테스트 리포트
- 발견된 이슈 수정

---

### Phase 4: 샘플 데이터 및 문서화 (순차, 4시간)

**Task Agent 5 - 샘플 및 문서**:

**작업 내용**:
1. 샘플 프로세스 3개 JSON 작성
2. 벡터 스토어 생성 (Python 스크립트)
3. 사용자 가이드 작성
4. LibreChat 설정 가이드

**산출물**:
```
docs/
├── ADMIN_GUIDE.md
├── USER_GUIDE.md
├── SETUP.md
└── LIBRECHAT_SETUP.md
```

---

## 🚀 실행 방법

### 병렬 실행 (권장):
```
1. Phase 1: 3개 Agent 동시 실행 (초기화)
2. Phase 2: 3개 Agent 동시 실행 (개발)
   - Admin Builder
   - User Executor
   - Admin Dashboard
3. Phase 3: 1개 Agent (통합 검증)
4. Phase 4: 1개 Agent (샘플/문서)
```

### 순차 실행 (안전):
```
1. Phase 1: User Executor 초기화 + 개발
2. Phase 2: Admin Builder 개발
3. Phase 3: Admin Dashboard 개발
4. Phase 4: 통합 및 샘플/문서
```

---

## ✅ 체크포인트

각 Phase 완료 후 확인:

### Phase 1 완료 확인:
- [ ] 3개 프로젝트 폴더 생성됨
- [ ] npm install 성공
- [ ] 기본 파일 구조 생성됨

### Phase 2 완료 확인:
- [ ] Admin Builder: `npm run dev` 실행 가능
- [ ] User Executor: `start.bat` 실행 가능
- [ ] Admin Dashboard: `npm run dev` 실행 가능

### Phase 3 완료 확인:
- [ ] JSON 포맷 일치
- [ ] ZIP 포맷 일치
- [ ] 전체 플로우 테스트 통과

### Phase 4 완료 확인:
- [ ] 샘플 프로세스 3개 정상 작동
- [ ] 문서 4개 작성 완료

---

## 📊 진행 상황 추적

각 Agent 완료 시 TODO 업데이트:
- [ ] Phase 1: 프로젝트 초기화
- [ ] Phase 2: Admin Builder 개발
- [ ] Phase 2: User Executor 개발
- [ ] Phase 2: Admin Dashboard 개발
- [ ] Phase 3: 통합 검증
- [ ] Phase 4: 샘플 데이터 및 문서화

---

## 🎯 최종 산출물

```
business-process-executor/
├── admin-builder/           # React Flow 프로세스 빌더
├── user-executor/           # Vanilla JS 실행기
├── admin-dashboard/         # React 대시보드
├── docs/                    # 문서
├── README.md
├── ARCHITECTURE.md
├── SETUP.md
└── IMPLEMENTATION_PLAN.md
```

---

## 🔧 도구 사용

- **Read**: 참고 문서 읽기
- **Write**: 새 파일 생성
- **Edit**: 기존 파일 수정
- **Bash**: npm 명령어, 폴더 생성
- **Task**: 하위 Agent 실행

---

**작성일**: 2026-01-04
**작성자**: Claude (Sonnet 4.5)
**버전**: 1.0.0
