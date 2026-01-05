# 🏗️ 시스템 아키텍처 (System Architecture)

## 📋 목차
1. [전체 시스템 구조](#전체-시스템-구조)
2. [관리자 빌더](#관리자-빌더)
3. [사용자 실행기](#사용자-실행기)
4. [추적 관리 시스템](#추적-관리-시스템)
5. [AI 챗봇](#ai-챗봇)
6. [데이터 구조](#데이터-구조)
7. [보안 및 성능](#보안-및-성능)

---

## 🔄 전체 시스템 구조

```
┌─────────────────────────────────────────────────────────────────┐
│                        관리자 PC (Admin)                          │
├─────────────────────────────────────────────────────────────────┤
│  1. React Flow 기반 프로세스 빌더                                 │
│     ↓ 노드 추가 (시작/작업/조건/종료)                             │
│     ↓ 연결선으로 흐름 정의                                        │
│     ↓ 각 노드에 체크리스트/폼 필드 설정                           │
│  2. 벡터 스토어 생성 (임베딩)                                     │
│     ↓ 업무 가이드 문서 → OpenAI/Ollama 임베딩                    │
│  3. JSON + Vector Store 내보내기                                 │
│     ↓ process-{name}.json                                       │
│     ↓ vector-{name}.json                                        │
│  4. 이메일/공유 폴더로 배포                                       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                        사용자 PC (User)                           │
├─────────────────────────────────────────────────────────────────┤
│  1. JSON 파일 로드                                                │
│     ↓ 드래그 앤 드롭 또는 파일 선택                               │
│  2. IndexedDB에 저장                                              │
│     ↓ 프로세스 템플릿 저장                                        │
│     ↓ 진행 상황 저장 (자동 백업)                                  │
│  3. 단계별 실행                                                   │
│     ↓ 체크리스트 확인                                             │
│     ↓ 폼 필드 입력 (텍스트/숫자/파일/날짜)                        │
│     ↓ AI 챗봇 질의 (궁금한 점)                                    │
│  4. 완료 후 ZIP 생성                                              │
│     ↓ process-completed.json                                    │
│     ↓ attachments/ (업로드한 파일들)                              │
│  5. 관리자에게 제출 (이메일/공유 폴더)                            │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    관리자 대시보드 (Admin Dashboard)               │
├─────────────────────────────────────────────────────────────────┤
│  1. ZIP 파일 수집                                                 │
│  2. 진행 현황 분석                                                │
│     • 부서별/업무별 통계                                          │
│     • 평균 소요 시간                                              │
│     • 병목 단계 파악                                              │
│  3. 알림 시스템                                                   │
│     • 마감일 임박 알림                                            │
│     • 지연 업무 알림                                              │
│  4. 보고서 생성                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 👨‍💼 관리자 빌더 (Admin Builder)

### 기술 스택
- **프레임워크**: React 19 + TypeScript
- **UI 라이브러리**: React Flow 11 (드래그 앤 드롭)
- **상태 관리**: Zustand
- **빌드 도구**: Vite
- **스타일링**: TailwindCSS

### 컴포넌트 구조

```
admin-builder/src/
├── components/
│   ├── ProcessBuilder.tsx          # 메인 캔버스
│   │   ├── ReactFlow 설정
│   │   ├── 노드/엣지 상태 관리
│   │   └── 드래그 앤 드롭 핸들러
│   ├── nodes/                      # 커스텀 노드
│   │   ├── StartNode.tsx           # 시작 노드
│   │   ├── TaskNode.tsx            # 작업 노드 (체크리스트/폼)
│   │   ├── ConditionNode.tsx       # 조건 분기 노드
│   │   ├── EndNode.tsx             # 종료 노드
│   │   └── NodeEditor.tsx          # 노드 속성 편집 패널
│   ├── sidebar/
│   │   ├── NodePalette.tsx         # 노드 팔레트 (드래그 소스)
│   │   ├── ProcessSettings.tsx     # 프로세스 전역 설정
│   │   └── TrackingSettings.tsx    # 추적 관리 설정 (NEW)
│   ├── export/
│   │   ├── ExportButton.tsx        # 내보내기 버튼
│   │   └── PreviewModal.tsx        # JSON 미리보기
│   └── vector/
│       ├── VectorStoreBuilder.tsx  # 벡터 스토어 생성
│       └── DocumentUploader.tsx    # 가이드 문서 업로드
├── stores/
│   └── process-store.ts            # Zustand 스토어
│       ├── nodes: Node[]
│       ├── edges: Edge[]
│       ├── selectedNode: string | null
│       ├── tracking: TrackingConfig (NEW)
│       └── actions: { addNode, removeNode, ... }
├── services/
│   ├── export-service.ts           # JSON 생성
│   │   ├── validateProcess()      # 프로세스 검증
│   │   ├── generateJSON()         # JSON 구조 생성
│   │   └── downloadFile()         # 파일 다운로드
│   ├── vector-service.ts           # 벡터 스토어 생성
│   │   ├── generateEmbeddings()   # 임베딩 생성
│   │   └── saveVectorStore()      # JSON 저장
│   └── tracking-service.ts         # 추적 관리 (NEW)
│       ├── generateId()           # 고유 ID 생성
│       └── validateTracking()     # 추적 정보 검증
└── types/
    ├── process.types.ts            # 프로세스 타입 정의
    └── tracking.types.ts           # 추적 관리 타입 (NEW)
```

### 노드 타입 정의

```typescript
// StartNode
{
  id: 'start-1',
  type: 'start',
  data: {
    label: '프로세스 시작',
    description: '예산 신청 프로세스를 시작합니다'
  },
  position: { x: 250, y: 0 }
}

// TaskNode
{
  id: 'task-1',
  type: 'task',
  data: {
    label: '예산 항목 작성',
    description: '각 항목별 예산을 작성하세요',
    checklist: [
      { id: 'check-1', text: '인건비 항목 작성', required: true },
      { id: 'check-2', text: '운영비 항목 작성', required: true }
    ],
    fields: [
      {
        id: 'field-1',
        type: 'number',
        label: '총 예산액 (원)',
        required: true,
        validation: { min: 0, max: 100000000 }
      },
      {
        id: 'field-2',
        type: 'file',
        label: '예산 근거 서류',
        required: true,
        validation: {
          accept: '.pdf,.xlsx',
          maxSize: 10485760  // 10MB
        }
      }
    ]
  },
  position: { x: 250, y: 100 }
}

// ConditionNode
{
  id: 'condition-1',
  type: 'condition',
  data: {
    label: '예산 승인 조건',
    condition: {
      field: 'field-1',  // 총 예산액
      operator: '>=',
      value: 10000000     // 1천만원
    },
    trueLabel: '고액 승인',
    falseLabel: '일반 승인'
  },
  position: { x: 250, y: 200 }
}

// EndNode
{
  id: 'end-1',
  type: 'end',
  data: {
    label: '프로세스 완료',
    successMessage: '예산 신청이 완료되었습니다!'
  },
  position: { x: 250, y: 300 }
}
```

### 프로세스 검증 로직

```typescript
// services/export-service.ts
export function validateProcess(nodes: Node[], edges: Edge[]): ValidationResult {
  const errors: string[] = [];

  // 1. Start 노드 확인
  const startNodes = nodes.filter(n => n.type === 'start');
  if (startNodes.length === 0) {
    errors.push('Start 노드가 없습니다');
  } else if (startNodes.length > 1) {
    errors.push('Start 노드는 하나만 있어야 합니다');
  }

  // 2. End 노드 확인
  const endNodes = nodes.filter(n => n.type === 'end');
  if (endNodes.length === 0) {
    errors.push('End 노드가 없습니다');
  }

  // 3. 연결 검증
  for (const node of nodes) {
    if (node.type === 'start') continue;
    const incomingEdges = edges.filter(e => e.target === node.id);
    if (incomingEdges.length === 0) {
      errors.push(`${node.data.label} 노드가 연결되지 않았습니다`);
    }
  }

  // 4. 순환 참조 검증
  if (hasCycle(nodes, edges)) {
    errors.push('순환 참조가 존재합니다');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
```

---

## 👨‍💻 사용자 실행기 (User Executor)

### 기술 스택
- **언어**: Vanilla JavaScript (ES6+)
- **스타일**: CSS3 (Flexbox/Grid)
- **로컬 저장**: IndexedDB
- **파일 압축**: JSZip

### 폴더 구조

```
user-executor/
├── index.html                # 메인 HTML
├── css/
│   ├── main.css             # 레이아웃
│   ├── sidebar.css          # 사이드바
│   ├── chatbot.css          # 챗봇 패널
│   └── tracking.css         # 추적 정보 표시 (NEW)
├── js/
│   ├── app.js               # 앱 초기화
│   ├── indexeddb.js         # IndexedDB 관리
│   ├── process-executor.js  # 프로세스 실행 로직
│   ├── file-handler.js      # JSON/파일 처리
│   ├── chatbot.js           # AI 챗봇
│   ├── tracking.js          # 추적 관리 (NEW)
│   └── ui.js                # UI 렌더링
└── vendor/
    └── jszip.min.js         # ZIP 라이브러리
```

### UI 레이아웃 (2-Column + Floating Chatbot)

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>업무 프로세스 실행</title>
  <link rel="stylesheet" href="css/main.css">
  <link rel="stylesheet" href="css/sidebar.css">
  <link rel="stylesheet" href="css/chatbot.css">
  <link rel="stylesheet" href="css/tracking.css">
</head>
<body>
  <!-- 헤더 -->
  <header class="header">
    <h1>업무 프로세스 실행 시스템</h1>
    <div class="header-actions">
      <span id="tracking-info" class="tracking-badge"></span>
      <button id="import-btn">📁 프로세스 불러오기</button>
      <button id="export-btn" disabled>💾 완료 내보내기</button>
    </div>
  </header>

  <!-- 메인 컨테이너 (2-Column) -->
  <div class="container">
    <!-- 좌측 사이드바: 프로세스 목록 -->
    <aside class="sidebar">
      <h2>내 업무 목록</h2>
      <div id="process-list" class="process-list">
        <!-- 동적으로 생성 -->
      </div>
    </aside>

    <!-- 우측 메인: 프로세스 실행 -->
    <main class="main-content">
      <div id="process-view" class="process-view">
        <!-- 초기 상태 -->
        <div class="empty-state">
          <p>좌측에서 프로세스를 선택하거나 새로 불러오세요</p>
        </div>
      </div>
    </main>
  </div>

  <!-- 플로팅 챗봇 버튼 -->
  <button id="chatbot-toggle" class="chatbot-toggle">
    💬 AI 도움말
  </button>

  <!-- 챗봇 슬라이드 패널 -->
  <div id="chatbot-panel" class="chatbot-panel">
    <div class="chatbot-header">
      <h3>AI 업무 도우미</h3>
      <button id="chatbot-close">✖</button>
    </div>
    <iframe
      id="chatbot-iframe"
      src="http://localhost:3000"
      width="100%"
      height="100%"
      style="border: none;">
    </iframe>
  </div>

  <!-- 스크립트 -->
  <script src="vendor/jszip.min.js"></script>
  <script src="js/indexeddb.js"></script>
  <script src="js/process-executor.js"></script>
  <script src="js/file-handler.js"></script>
  <script src="js/chatbot.js"></script>
  <script src="js/tracking.js"></script>
  <script src="js/ui.js"></script>
  <script src="js/app.js"></script>
</body>
</html>
```

### IndexedDB 스키마

```javascript
// js/indexeddb.js
const DB_NAME = 'ProcessExecutorDB';
const DB_VERSION = 2;  // v2: 추적 관리 추가

function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // 1. processes 스토어 (프로세스 템플릿)
      if (!db.objectStoreNames.contains('processes')) {
        const processStore = db.createObjectStore('processes', {
          keyPath: 'id'
        });
        processStore.createIndex('name', 'name', { unique: false });
        processStore.createIndex('departmentId', 'tracking.departmentId', {
          unique: false
        });
      }

      // 2. progresses 스토어 (진행 상황)
      if (!db.objectStoreNames.contains('progresses')) {
        const progressStore = db.createObjectStore('progresses', {
          keyPath: 'id',
          autoIncrement: true
        });
        progressStore.createIndex('processId', 'processId', {
          unique: false
        });
        progressStore.createIndex('status', 'progress.status', {
          unique: false
        });
        progressStore.createIndex('assignedTo', 'tracking.assignedTo', {
          unique: false
        });
      }

      // 3. files 스토어 (첨부 파일 - Blob)
      if (!db.objectStoreNames.contains('files')) {
        const fileStore = db.createObjectStore('files', {
          keyPath: 'id'
        });
        fileStore.createIndex('progressId', 'progressId', {
          unique: false
        });
      }

      // 4. logs 스토어 (변경 이력 - NEW)
      if (!db.objectStoreNames.contains('logs')) {
        const logStore = db.createObjectStore('logs', {
          keyPath: 'id',
          autoIncrement: true
        });
        logStore.createIndex('progressId', 'progressId', {
          unique: false
        });
        logStore.createIndex('timestamp', 'timestamp', {
          unique: false
        });
      }
    };
  });
}
```

### 프로세스 실행 로직

```javascript
// js/process-executor.js
class ProcessExecutor {
  constructor(processData) {
    this.processData = processData;
    this.currentStepIndex = 0;
    this.progress = {
      id: Date.now(),
      processId: processData.id,
      tracking: processData.tracking,  // NEW: 추적 정보 복사
      progress: {
        status: 'draft',
        currentStepId: null,
        completedSteps: [],
        startedAt: null,
        lastUpdated: new Date().toISOString(),
        timeSpent: 0,
        logs: []
      },
      stepData: {}
    };
  }

  start() {
    this.progress.progress.status = 'in_progress';
    this.progress.progress.startedAt = new Date().toISOString();
    this.addLog('process_started', null);
    this.goToStep(0);
  }

  goToStep(index) {
    const step = this.processData.steps[index];
    if (!step) return;

    this.currentStepIndex = index;
    this.progress.progress.currentStepId = step.id;
    this.progress.progress.lastUpdated = new Date().toISOString();

    this.renderStep(step);
    this.saveProgress();
  }

  completeStep() {
    const step = this.processData.steps[this.currentStepIndex];

    // 체크리스트 검증
    const requiredChecks = step.checklist.filter(c => c.required);
    const completedChecks = this.progress.stepData[step.id]?.checklist || [];
    if (requiredChecks.length !== completedChecks.length) {
      alert('필수 체크리스트를 모두 완료해주세요');
      return;
    }

    // 필드 검증
    const requiredFields = step.fields.filter(f => f.required);
    const fieldData = this.progress.stepData[step.id]?.fields || {};
    for (const field of requiredFields) {
      if (!fieldData[field.id]) {
        alert(`${field.label}을(를) 입력해주세요`);
        return;
      }
    }

    // 완료 처리
    this.progress.progress.completedSteps.push(step.id);
    this.addLog('step_completed', step.id);

    // 다음 단계
    if (this.currentStepIndex < this.processData.steps.length - 1) {
      this.goToStep(this.currentStepIndex + 1);
    } else {
      this.complete();
    }
  }

  complete() {
    this.progress.progress.status = 'completed';
    this.progress.progress.lastUpdated = new Date().toISOString();
    this.addLog('process_completed', null);
    this.saveProgress();

    alert('프로세스가 완료되었습니다! 이제 내보내기 할 수 있습니다.');
    document.getElementById('export-btn').disabled = false;
  }

  addLog(action, stepId) {
    const log = {
      id: Date.now() + Math.random(),
      progressId: this.progress.id,
      timestamp: new Date().toISOString(),
      action,
      stepId,
      userId: this.progress.tracking.assignedTo
    };

    this.progress.progress.logs.push(log);

    // logs 스토어에도 저장 (검색 용이)
    const db = await initDB();
    const tx = db.transaction(['logs'], 'readwrite');
    tx.objectStore('logs').add(log);
  }

  async saveProgress() {
    const db = await initDB();
    const tx = db.transaction(['progresses'], 'readwrite');
    await tx.objectStore('progresses').put(this.progress);
  }

  renderStep(step) {
    const container = document.getElementById('process-view');
    container.innerHTML = `
      <div class="step-view">
        <h2>${step.title}</h2>
        <p>${step.description || ''}</p>

        <!-- 체크리스트 -->
        ${this.renderChecklist(step)}

        <!-- 폼 필드 -->
        ${this.renderFields(step)}

        <!-- 네비게이션 -->
        <div class="step-nav">
          <button
            ${this.currentStepIndex === 0 ? 'disabled' : ''}
            onclick="executor.goToStep(${this.currentStepIndex - 1})">
            ◀ 이전
          </button>
          <button onclick="executor.completeStep()">
            다음 ▶
          </button>
        </div>
      </div>
    `;
  }

  renderChecklist(step) {
    if (!step.checklist || step.checklist.length === 0) return '';

    return `
      <div class="checklist">
        <h3>체크리스트</h3>
        ${step.checklist.map(item => `
          <label>
            <input
              type="checkbox"
              id="check-${item.id}"
              ${item.required ? 'required' : ''}
              onchange="executor.handleChecklistChange('${step.id}', '${item.id}', this.checked)">
            ${item.text} ${item.required ? '<span class="required">*</span>' : ''}
          </label>
        `).join('')}
      </div>
    `;
  }

  renderFields(step) {
    if (!step.fields || step.fields.length === 0) return '';

    return `
      <div class="fields">
        <h3>입력 항목</h3>
        ${step.fields.map(field => {
          switch (field.type) {
            case 'text':
              return `
                <label>
                  ${field.label} ${field.required ? '<span class="required">*</span>' : ''}
                  <input
                    type="text"
                    id="field-${field.id}"
                    ${field.required ? 'required' : ''}
                    onchange="executor.handleFieldChange('${step.id}', '${field.id}', this.value)">
                </label>
              `;
            case 'number':
              return `
                <label>
                  ${field.label} ${field.required ? '<span class="required">*</span>' : ''}
                  <input
                    type="number"
                    id="field-${field.id}"
                    ${field.validation?.min ? `min="${field.validation.min}"` : ''}
                    ${field.validation?.max ? `max="${field.validation.max}"` : ''}
                    ${field.required ? 'required' : ''}
                    onchange="executor.handleFieldChange('${step.id}', '${field.id}', this.value)">
                </label>
              `;
            case 'file':
              return `
                <label>
                  ${field.label} ${field.required ? '<span class="required">*</span>' : ''}
                  <input
                    type="file"
                    id="field-${field.id}"
                    ${field.validation?.accept ? `accept="${field.validation.accept}"` : ''}
                    ${field.required ? 'required' : ''}
                    onchange="executor.handleFileChange('${step.id}', '${field.id}', this.files[0])">
                </label>
              `;
            // 기타 필드 타입...
          }
        }).join('')}
      </div>
    `;
  }

  handleChecklistChange(stepId, checkId, checked) {
    if (!this.progress.stepData[stepId]) {
      this.progress.stepData[stepId] = { checklist: [], fields: {} };
    }

    if (checked) {
      this.progress.stepData[stepId].checklist.push(checkId);
    } else {
      this.progress.stepData[stepId].checklist =
        this.progress.stepData[stepId].checklist.filter(id => id !== checkId);
    }

    this.saveProgress();
  }

  async handleFileChange(stepId, fieldId, file) {
    if (!file) return;

    // 파일 크기 검증
    const field = this.processData.steps
      .find(s => s.id === stepId)
      .fields.find(f => f.id === fieldId);

    if (field.validation?.maxSize && file.size > field.validation.maxSize) {
      alert(`파일 크기는 ${field.validation.maxSize / 1024 / 1024}MB 이하여야 합니다`);
      return;
    }

    // IndexedDB에 Blob 저장
    const fileId = `file-${Date.now()}`;
    const db = await initDB();
    const tx = db.transaction(['files'], 'readwrite');
    await tx.objectStore('files').add({
      id: fileId,
      progressId: this.progress.id,
      name: file.name,
      type: file.type,
      size: file.size,
      blob: file
    });

    // progress에는 파일 ID만 저장
    if (!this.progress.stepData[stepId]) {
      this.progress.stepData[stepId] = { checklist: [], fields: {} };
    }
    this.progress.stepData[stepId].fields[fieldId] = {
      fileId,
      name: file.name,
      size: file.size,
      type: file.type
    };

    this.saveProgress();
  }
}
```

---

## 📊 추적 관리 시스템 (Tracking System)

### 데이터 구조

```json
{
  "tracking": {
    // 조직 정보
    "organizationId": "CORP-2026",          // 조직 ID
    "departmentId": "DEPT-HR",              // 부서 ID
    "departmentName": "인사팀",             // 부서명

    // 업무 정보
    "processType": "ONBOARDING",            // 업무 유형
    "processCategory": "신규입사",          // 업무 분류
    "priority": "high",                     // 우선순위 (low/medium/high/urgent)

    // 담당자 정보
    "assignedTo": "USER-12345",             // 담당자 ID
    "assignedToName": "홍길동",             // 담당자 이름
    "assignedToEmail": "hong@example.com",  // 담당자 이메일

    // 생성자 정보
    "createdBy": "ADMIN-001",               // 생성자 ID
    "createdByName": "관리자",              // 생성자 이름
    "createdAt": "2026-01-04T10:30:00Z",   // 생성 시각

    // 기한 정보
    "dueDate": "2026-01-11T17:00:00Z",     // 마감일
    "estimatedHours": 8,                    // 예상 소요 시간 (시간)

    // 태그 (검색/필터링용)
    "tags": ["신입사원", "2026년1월", "긴급"]
  }
}
```

### 진행 상황 추적

```json
{
  "progress": {
    // 상태 정보
    "status": "in_progress",                // draft/in_progress/completed/archived
    "currentStepId": "step-3",              // 현재 단계
    "completedSteps": ["step-1", "step-2"], // 완료된 단계

    // 시간 정보
    "startedAt": "2026-01-04T11:00:00Z",   // 시작 시각
    "lastUpdated": "2026-01-04T14:30:00Z", // 마지막 업데이트
    "completedAt": null,                    // 완료 시각 (완료 시)
    "timeSpent": 12600,                     // 소요 시간 (초)

    // 변경 이력
    "logs": [
      {
        "id": "log-1",
        "timestamp": "2026-01-04T11:00:00Z",
        "action": "process_started",        // 이벤트 타입
        "stepId": null,
        "userId": "USER-12345",
        "metadata": {}                      // 추가 데이터
      },
      {
        "id": "log-2",
        "timestamp": "2026-01-04T12:00:00Z",
        "action": "step_completed",
        "stepId": "step-1",
        "userId": "USER-12345",
        "metadata": {
          "duration": 3600  // 1시간 소요
        }
      }
    ]
  }
}
```

### ID 생성 규칙

```javascript
// js/tracking.js
class TrackingManager {
  // 조직 ID: CORP-YYYY
  generateOrganizationId() {
    const year = new Date().getFullYear();
    return `CORP-${year}`;
  }

  // 부서 ID: DEPT-{CODE}
  generateDepartmentId(departmentCode) {
    return `DEPT-${departmentCode.toUpperCase()}`;
  }

  // 사용자 ID: USER-{5자리숫자}
  generateUserId() {
    const num = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `USER-${num}`;
  }

  // 프로세스 ID: PROC-{YYYYMMDD}-{4자리숫자}
  generateProcessId() {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const num = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `PROC-${date}-${num}`;
  }

  // 진행 ID: PROG-{timestamp}
  generateProgressId() {
    return `PROG-${Date.now()}`;
  }
}
```

### 통계 및 분석

```javascript
// 부서별 통계
async function getDepartmentStats(departmentId) {
  const db = await initDB();
  const tx = db.transaction(['progresses'], 'readonly');
  const store = tx.objectStore('progresses');
  const index = store.index('assignedTo');

  const progresses = await getAllFromIndex(index, departmentId);

  return {
    total: progresses.length,
    draft: progresses.filter(p => p.progress.status === 'draft').length,
    inProgress: progresses.filter(p => p.progress.status === 'in_progress').length,
    completed: progresses.filter(p => p.progress.status === 'completed').length,
    overdue: progresses.filter(p => isOverdue(p)).length,
    avgTimeSpent: calculateAvgTime(progresses)
  };
}

// 병목 단계 분석
async function analyzeBottlenecks(processId) {
  const db = await initDB();
  const tx = db.transaction(['logs'], 'readonly');
  const store = tx.objectStore('logs');
  const index = store.index('progressId');

  const logs = await getAllFromIndex(index, processId);
  const stepDurations = {};

  for (let i = 0; i < logs.length - 1; i++) {
    const log = logs[i];
    if (log.action === 'step_completed') {
      const duration = new Date(logs[i + 1].timestamp) - new Date(log.timestamp);
      if (!stepDurations[log.stepId]) {
        stepDurations[log.stepId] = [];
      }
      stepDurations[log.stepId].push(duration);
    }
  }

  // 평균 소요 시간 계산
  const result = {};
  for (const [stepId, durations] of Object.entries(stepDurations)) {
    const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
    result[stepId] = {
      count: durations.length,
      avgDuration: avg,
      maxDuration: Math.max(...durations),
      minDuration: Math.min(...durations)
    };
  }

  return result;
}
```

---

## 🤖 AI 챗봇 (AI Chatbot)

### 아키텍처

```
사용자 질문
   ↓
1. 벡터 검색 (js/chatbot.js)
   ↓ 코사인 유사도로 관련 문서 찾기
   ↓ Top 3 결과 추출
2. LibreChat에 컨텍스트 전달
   ↓ iframe postMessage API
3. Ollama LLM 호출
   ↓ 로컬 모델 (llama2, mistral 등)
4. 답변 생성
   ↓
사용자에게 표시
```

### 벡터 검색 구현

```javascript
// js/chatbot.js
class VectorSearch {
  constructor(vectorStore) {
    this.documents = vectorStore.documents;  // [{ text, embedding }]
  }

  // 코사인 유사도 계산
  cosineSimilarity(vecA, vecB) {
    const dotProduct = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
    const magA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
    const magB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
    return dotProduct / (magA * magB);
  }

  // 쿼리 임베딩 생성 (간단한 TF-IDF)
  async generateEmbedding(query) {
    // 실제로는 Ollama API 호출하여 임베딩 생성
    // 여기서는 간단한 TF-IDF로 대체
    const words = query.toLowerCase().split(/\s+/);
    const embedding = new Array(384).fill(0);  // 384차원

    for (const word of words) {
      const hash = this.hashString(word);
      embedding[hash % 384] += 1;
    }

    // 정규화
    const mag = Math.sqrt(embedding.reduce((sum, v) => sum + v * v, 0));
    return embedding.map(v => v / mag);
  }

  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }

  // 유사한 문서 검색
  async search(query, topK = 3) {
    const queryEmbedding = await this.generateEmbedding(query);

    const scores = this.documents.map(doc => ({
      text: doc.text,
      score: this.cosineSimilarity(queryEmbedding, doc.embedding)
    }));

    scores.sort((a, b) => b.score - a.score);
    return scores.slice(0, topK);
  }
}

// 챗봇 초기화
let vectorSearch;

async function initChatbot(processId) {
  // 벡터 스토어 로드
  const vectorStore = await loadVectorStore(processId);
  vectorSearch = new VectorSearch(vectorStore);

  // LibreChat iframe 설정
  const iframe = document.getElementById('chatbot-iframe');
  iframe.contentWindow.postMessage({
    type: 'init',
    systemPrompt: `당신은 ${processId} 업무 프로세스 도우미입니다.
사용자의 업무 진행을 도와주세요.`
  }, '*');
}

// 사용자 질문 처리
async function handleUserQuestion(question) {
  // 1. 벡터 검색으로 관련 문서 찾기
  const relevantDocs = await vectorSearch.search(question);

  // 2. 컨텍스트 구성
  const context = relevantDocs.map(doc => doc.text).join('\n\n');

  // 3. LibreChat에 전달
  const iframe = document.getElementById('chatbot-iframe');
  iframe.contentWindow.postMessage({
    type: 'chat',
    message: question,
    context: context
  }, '*');
}
```

### LibreChat 통합

```javascript
// LibreChat와 통신
window.addEventListener('message', (event) => {
  if (event.origin !== 'http://localhost:3000') return;

  const { type, data } = event.data;

  switch (type) {
    case 'ready':
      console.log('LibreChat 준비 완료');
      break;
    case 'response':
      console.log('AI 답변:', data.message);
      break;
  }
});

// 플로팅 버튼 클릭
document.getElementById('chatbot-toggle').addEventListener('click', () => {
  const panel = document.getElementById('chatbot-panel');
  panel.classList.toggle('open');
});

document.getElementById('chatbot-close').addEventListener('click', () => {
  const panel = document.getElementById('chatbot-panel');
  panel.classList.remove('open');
});
```

---

## 🔒 보안 및 성능

### 보안 고려사항

1. **XSS 방지**: 사용자 입력 sanitize
```javascript
function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}
```

2. **파일 업로드 검증**
```javascript
const ALLOWED_TYPES = ['.pdf', '.xlsx', '.docx', '.jpg', '.png'];
const MAX_FILE_SIZE = 10 * 1024 * 1024;  // 10MB

function validateFile(file, field) {
  // 확장자 검증
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  if (field.validation?.accept && !field.validation.accept.includes(ext)) {
    throw new Error(`허용되지 않은 파일 형식: ${ext}`);
  }

  // 크기 검증
  const maxSize = field.validation?.maxSize || MAX_FILE_SIZE;
  if (file.size > maxSize) {
    throw new Error(`파일 크기 초과: ${file.size} > ${maxSize}`);
  }

  return true;
}
```

3. **IndexedDB Blob 사용** (Base64 대신)
```javascript
// ❌ 보안 위험
{
  "file": {
    "base64": "data:application/pdf;base64,JVBERi0..."  // XSS 위험!
  }
}

// ✅ 안전
{
  "file": {
    "fileId": "file-abc123",  // IndexedDB 참조
    "name": "document.pdf",
    "size": 1048576
  }
}
```

### 성능 최적화

1. **노드/엣지 메모이제이션** (관리자 빌더)
```typescript
const nodeTypes = useMemo(() => ({
  start: StartNode,
  task: TaskNode,
  condition: ConditionNode,
  end: EndNode
}), []);
```

2. **IndexedDB 인덱스 활용**
```javascript
// 부서별 조회
const index = store.index('departmentId');
const progresses = await index.getAll('DEPT-HR');

// 상태별 조회
const statusIndex = store.index('status');
const inProgress = await statusIndex.getAll('in_progress');
```

3. **벡터 검색 캐싱**
```javascript
const searchCache = new Map();

async function cachedSearch(query) {
  const cacheKey = query.toLowerCase();
  if (searchCache.has(cacheKey)) {
    return searchCache.get(cacheKey);
  }

  const results = await vectorSearch.search(query);
  searchCache.set(cacheKey, results);
  return results;
}
```

4. **Lazy Loading**
```javascript
// 프로세스 목록은 페이지네이션
async function loadProcessList(page = 0, pageSize = 20) {
  const db = await initDB();
  const tx = db.transaction(['progresses'], 'readonly');
  const store = tx.objectStore('progresses');

  const cursor = await store.openCursor();
  const results = [];
  let skipped = 0;
  let loaded = 0;

  while (cursor && loaded < pageSize) {
    if (skipped >= page * pageSize) {
      results.push(cursor.value);
      loaded++;
    } else {
      skipped++;
    }
    await cursor.continue();
  }

  return results;
}
```

---

## 📈 확장 가능성

### 데스크톱 앱 전환 (Tauri)

```bash
# 1. Tauri 초기화
npm install -D @tauri-apps/cli
npx tauri init

# 2. src-tauri/tauri.conf.json 설정
{
  "build": {
    "devPath": "../user-executor",
    "distDir": "../user-executor"
  },
  "tauri": {
    "allowlist": {
      "fs": {
        "readFile": true,
        "writeFile": true
      },
      "dialog": {
        "open": true,
        "save": true
      }
    }
  }
}

# 3. 빌드
npm run tauri build
```

### 서버 동기화 (선택적)

```javascript
// 선택적: 서버에 진행 상황 자동 백업
async function syncToServer(progressId) {
  const progress = await getProgress(progressId);

  await fetch('https://api.example.com/sync', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(progress)
  });
}

// 주기적 동기화 (5분마다)
setInterval(() => {
  const progresses = await getAllProgresses();
  for (const progress of progresses) {
    if (progress.progress.status === 'in_progress') {
      await syncToServer(progress.id);
    }
  }
}, 5 * 60 * 1000);
```

---

**작성일**: 2026-01-04
**버전**: 2.0.0
**작성자**: Claude (Sonnet 4.5)
