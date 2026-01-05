# 🚀 구현 계획 (Implementation Plan)

## 📋 프로젝트 개요

**프로젝트**: 업무 프로세스 실행 시스템 v2.0 (추적 관리 포함)
**총 예상 시간**: 33시간
**개발 방식**: Agent 기반 병렬 개발

---

## 🎯 3대 핵심 컴포넌트

### 1. Admin Builder (관리자 빌더)
**기술**: React 19 + TypeScript + React Flow + Zustand
**예상 시간**: 12시간
**주요 기능**:
- React Flow 드래그 앤 드롭 캔버스
- 노드 타입: Start, Task, Condition, End
- 추적 관리 설정 (부서/담당자/마감일)
- JSON + Vector Store 내보내기

### 2. User Executor (사용자 실행기)
**기술**: Vanilla JavaScript + IndexedDB + JSZip
**예상 시간**: 14시간
**주요 기능**:
- JSON 프로세스 로드
- 단계별 체크리스트/폼 실행
- 진행 상황 추적 및 로깅
- LibreChat 챗봇 통합 (iframe)
- ZIP 내보내기

### 3. Admin Dashboard (관리 대시보드)
**기술**: React 19 + TypeScript + Chart.js
**예상 시간**: 7시간
**주요 기능**:
- ZIP 파일 수집 및 분석
- 부서별/업무별/개인별 통계
- 병목 단계 분석
- 월간 리포트 생성

---

## 📅 Phase별 개발 계획

### Phase 1: 프로젝트 초기화 (2시간)

#### 1.1 Admin Builder 초기화 (1시간)
```bash
cd business-process-executor
npm create vite@latest admin-builder -- --template react-ts
cd admin-builder
npm install reactflow zustand lucide-react
npm install -D @types/node
```

**폴더 구조 생성**:
```
admin-builder/src/
├── components/
│   ├── ProcessBuilder.tsx
│   ├── nodes/
│   ├── sidebar/
│   └── export/
├── stores/
├── services/
└── types/
```

#### 1.2 User Executor 초기화 (30분)
```
user-executor/
├── index.html
├── css/ (3 files)
├── js/ (6 files)
├── vendor/
└── samples/
```

#### 1.3 Admin Dashboard 초기화 (30분)
```bash
npm create vite@latest admin-dashboard -- --template react-ts
cd admin-dashboard
npm install chart.js react-chartjs-2
```

---

### Phase 2: Admin Builder 개발 (10시간)

#### 2.1 React Flow 기본 설정 (2시간)
- [ ] ProcessBuilder 컴포넌트
- [ ] 기본 노드 타입 (Start, Task, End)
- [ ] 연결선 검증

#### 2.2 커스텀 노드 구현 (3시간)
- [ ] StartNode
- [ ] TaskNode (체크리스트 + 폼 필드)
- [ ] ConditionNode (조건 분기)
- [ ] EndNode

#### 2.3 노드 편집 패널 (2시간)
- [ ] 체크리스트 추가/제거
- [ ] 폼 필드 설정 (타입, 검증)
- [ ] 노드 속성 편집

#### 2.4 추적 관리 설정 (1시간)
- [ ] TrackingSettings 컴포넌트
- [ ] 부서/담당자/마감일 입력
- [ ] ID 생성 로직

#### 2.5 JSON 내보내기 (2시간)
- [ ] 프로세스 검증 (순환 참조, 연결 확인)
- [ ] JSON 구조 생성
- [ ] 파일 다운로드

---

### Phase 3: User Executor 개발 (12시간)

#### 3.1 기본 UI 레이아웃 (2시간)
- [ ] index.html (2-column layout)
- [ ] CSS 스타일링 (main, sidebar, chatbot)
- [ ] 반응형 디자인

#### 3.2 IndexedDB 관리 (2시간)
- [ ] DB 초기화 (5개 스토어)
- [ ] CRUD 헬퍼 함수
- [ ] 에러 처리

#### 3.3 프로세스 실행 로직 (4시간)
- [ ] ProcessExecutor 클래스
- [ ] 단계별 네비게이션
- [ ] 체크리스트 검증
- [ ] 폼 필드 검증
- [ ] 파일 업로드 (Blob 저장)

#### 3.4 추적 관리 (2시간)
- [ ] TrackingLogger 클래스
- [ ] 진행 상황 로깅
- [ ] 변경 이력 기록
- [ ] 마감일 계산

#### 3.5 파일 내보내기 (2시간)
- [ ] ZIP 생성 (JSZip)
- [ ] JSON + 첨부 파일 포함
- [ ] 다운로드

---

### Phase 4: AI 챗봇 통합 (2시간)

#### 4.1 LibreChat 설정 (1시간)
- [ ] Docker Compose 파일
- [ ] Ollama 연동 설정
- [ ] 환경 변수 구성

#### 4.2 iframe 통합 (1시간)
- [ ] 챗봇 패널 UI
- [ ] 토글 버튼
- [ ] 벡터 스토어 가이드

---

### Phase 5: Admin Dashboard 개발 (5시간)

#### 5.1 ZIP 파일 수집 (1시간)
- [ ] 파일 업로드 UI
- [ ] ZIP 파싱
- [ ] 데이터 추출

#### 5.2 통계 계산 (2시간)
- [ ] 부서별 통계
- [ ] 업무별 통계
- [ ] 병목 단계 분석

#### 5.3 차트 시각화 (1시간)
- [ ] Chart.js 설정
- [ ] 부서별 차트
- [ ] 업무별 차트

#### 5.4 리포트 생성 (1시간)
- [ ] 월간 리포트 JSON
- [ ] 다운로드 기능

---

### Phase 6: 샘플 데이터 (3시간)

#### 6.1 샘플 프로세스 JSON (2시간)
- [ ] onboarding.json (신입사원 온보딩)
- [ ] expense-report.json (경비 청구)
- [ ] leave-request.json (휴가 신청)

#### 6.2 벡터 스토어 (1시간)
- [ ] Python 임베딩 스크립트
- [ ] 3개 벡터 스토어 JSON

---

### Phase 7: 문서화 및 테스트 (4시간)

#### 7.1 사용자 가이드 (2시간)
- [ ] ADMIN_GUIDE.md
- [ ] USER_GUIDE.md
- [ ] SETUP.md

#### 7.2 테스트 (1시간)
- [ ] 전체 플로우 테스트
- [ ] 크로스 브라우저 테스트

#### 7.3 배포 스크립트 (1시간)
- [ ] start.bat
- [ ] start.sh
- [ ] README.md 최종 검토

---

## 🤖 Agent 활용 전략

### Option A: 3개 Agent 병렬 실행 (권장)

```
Agent 1: Admin Builder (12시간)
  ↓ React Flow + Zustand
  ↓ 노드 구현
  ↓ JSON 내보내기

Agent 2: User Executor (14시간)
  ↓ IndexedDB + UI
  ↓ 프로세스 실행
  ↓ 추적 관리

Agent 3: Admin Dashboard (7시간)
  ↓ 통계 계산
  ↓ Chart.js
  ↓ 리포트
```

**장점**:
- 병렬 개발로 시간 단축
- 각 Agent가 독립적으로 작업
- 최종 통합만 필요

**통합 시점**: 각 Agent 완료 후 1-2시간

---

### Option B: 순차 실행 (안전)

```
1. User Executor 먼저 (14시간)
   → 가장 복잡하고 핵심
2. Admin Builder (12시간)
   → User Executor JSON 구조 확인 후
3. Admin Dashboard (7시간)
   → User Executor 데이터 구조 확인 후
```

**장점**:
- 데이터 구조 일관성 보장
- 순차적 검증 가능

**단점**:
- 총 33시간 소요

---

## 📊 우선순위

### P0 (필수)
1. User Executor 기본 기능
2. Admin Builder 기본 기능
3. 샘플 프로세스 3개

### P1 (중요)
4. 추적 관리 시스템
5. LibreChat 통합
6. Admin Dashboard

### P2 (선택)
7. 고급 통계 (병목 분석)
8. 월간 리포트

---

## 🎯 이번 세션 목표

### 즉시 시작 가능한 작업

**Option 1: 병렬 Agent 3개 실행**
```bash
# Agent 1: Admin Builder 초기화 + 기본 구조
# Agent 2: User Executor 전체 개발
# Agent 3: Admin Dashboard 초기화 + 기본 구조
```

**Option 2: User Executor 집중**
```bash
# 가장 복잡한 User Executor부터 완성
# → Admin Builder는 JSON 구조 확인 후
```

---

## 📝 결정 사항

다음 중 선택해주세요:

1. **Option A (권장)**: 3개 Agent 병렬 실행
   - 빠른 진행 (병렬)
   - 최종 통합 필요

2. **Option B**: User Executor 먼저 완성
   - 안전한 순차 진행
   - 데이터 구조 확정 후 나머지

3. **Option C**: 단계별 진행
   - Phase 1만 먼저 (초기화)
   - 이후 단계는 순차적으로

---

**작성일**: 2026-01-04
**작성자**: Claude (Sonnet 4.5)
