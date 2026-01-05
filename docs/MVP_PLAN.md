# 📋 업무 프로세스 실행 시스템 MVP 계획 (v2.0)

## 🎯 프로젝트 개요

**프로젝트명**: 업무 프로세스 실행 시스템 (Business Process Executor)
**버전**: 2.0.0 (추적 관리 시스템 추가)
**목표**: 관리자가 만든 업무 프로세스를 사용자가 PC에서 오프라인으로 실행하는 시스템

---

## 💡 핵심 개념

### 워크플로우

```
1. [관리자] React Flow로 프로세스 생성
   ↓ 드래그 앤 드롭으로 단계 정의
   ↓ 체크리스트/폼 필드 설정
   ↓ 추적 관리 정보 설정 (부서/담당자/마감일) ⭐ NEW

2. [관리자] Vector Store 생성
   ↓ 업무 가이드 문서 업로드
   ↓ 임베딩 생성 (Ollama/OpenAI)

3. [관리자] JSON 내보내기
   ↓ process-{name}.json (프로세스 + 추적 정보)
   ↓ vector-{name}.json (벡터 스토어)

4. [배포] 이메일/공유 폴더로 전달

5. [사용자] PC에서 JSON 로드
   ↓ IndexedDB에 저장
   ↓ 단계별 실행
   ↓ AI 챗봇 활용
   ↓ 진행 상황 자동 추적 ⭐ NEW

6. [사용자] 완료 후 ZIP 생성
   ↓ process-completed.json (진행 상황 + 추적 로그)
   ↓ attachments/ (첨부 파일들)

7. [관리자] ZIP 수집
   ↓ 대시보드에서 통계 분석 ⭐ NEW
   ↓ 병목 단계 파악 ⭐ NEW
   ↓ 리포트 생성 ⭐ NEW
```

---

## 🏗️ 시스템 구조

### 1. 관리자 빌더 (Admin Builder)

**기술**: React + TypeScript + React Flow + Zustand

**주요 기능**:
- 드래그 앤 드롭으로 프로세스 생성
- 노드 타입: 시작/작업/조건/종료
- 각 노드에 체크리스트/폼 필드 설정
- 추적 관리 정보 설정 (부서/담당자/마감일 등) ⭐ NEW
- 벡터 스토어 생성 (가이드 문서 → 임베딩)
- JSON 내보내기 및 검증

**폴더 구조**:
```
admin-builder/
├── package.json
├── src/
│   ├── components/
│   │   ├── ProcessBuilder.tsx       # React Flow 캔버스
│   │   ├── nodes/                   # 커스텀 노드
│   │   ├── sidebar/
│   │   │   ├── NodePalette.tsx      # 노드 팔레트
│   │   │   └── TrackingSettings.tsx # 추적 설정 ⭐ NEW
│   │   └── export/
│   │       ├── ExportButton.tsx     # 내보내기
│   │       └── PreviewModal.tsx     # JSON 미리보기
│   ├── stores/
│   │   └── process-store.ts         # Zustand 스토어
│   ├── services/
│   │   ├── export-service.ts        # JSON 생성
│   │   ├── vector-service.ts        # 벡터 스토어
│   │   └── tracking-service.ts      # 추적 관리 ⭐ NEW
│   └── types/
│       ├── process.types.ts
│       └── tracking.types.ts        # ⭐ NEW
└── README.md
```

---

### 2. 사용자 실행기 (User Executor)

**기술**: Vanilla JavaScript + IndexedDB + JSZip

**주요 기능**:
- JSON 파일 로드 (드래그 앤 드롭 or 파일 선택)
- IndexedDB에 프로세스 템플릿 저장
- 단계별 체크리스트/폼 실행
- 진행 상황 자동 추적 및 로깅 ⭐ NEW
- AI 챗봇 (LibreChat + Ollama + 벡터 검색)
- 완료 후 ZIP 내보내기 (JSON + 첨부 파일)

**UI 레이아웃**:
```
┌────────────────────────────────────────────────────────┐
│  Header: 프로세스 실행 시스템 | [추적 정보 배지] ⭐    │
│          [불러오기] [내보내기]                          │
├────────────┬──────────────────────────────────────────┤
│  Sidebar   │  Main Content                             │
│            │                                            │
│  내 업무   │  ┌────────────────────────────────────┐  │
│  목록      │  │ 단계 제목                          │  │
│            │  │                                    │  │
│  • 온보딩  │  │ 체크리스트:                        │  │
│    (진행중)│  │ ☐ 항목 1                           │  │
│    [진행바]│  │ ☐ 항목 2                           │  │
│            │  │                                    │  │
│  • 예산신청│  │ 입력 항목:                         │  │
│    (완료)  │  │ 총 예산액: [_______]               │  │
│            │  │ 첨부 파일: [선택...]               │  │
│  • 휴가신청│  │                                    │  │
│    (대기)  │  │ [◀ 이전] [다음 ▶]                 │  │
│            │  └────────────────────────────────────┘  │
│            │                                            │
│  [추적정보]│  진행률: 40% | 소요시간: 2.5시간 ⭐    │
│  부서: HR  │  마감: 3일 후                      ⭐    │
│  담당: 홍길동│                                         │
└────────────┴──────────────────────────────────────────┘
                            ┌──────────────┐
                            │  💬 AI 도움말 │ ← 플로팅 버튼
                            └──────────────┘

                 ┌────────────────────────────┐
                 │  AI 업무 도우미        [✖] │
                 ├────────────────────────────┤
                 │  [LibreChat iframe]        │
                 │                            │
                 │  사용자: 예산 항목 작성이  │
                 │          어떻게 하나요?    │
                 │                            │
                 │  AI: 예산 항목은 다음과    │
                 │      같이 작성합니다...    │
                 └────────────────────────────┘ ← 슬라이드 패널
```

**폴더 구조**:
```
user-executor/
├── index.html
├── start.bat                        # Windows 실행
├── start.sh                         # Mac/Linux 실행
├── css/
│   ├── main.css
│   ├── sidebar.css
│   ├── chatbot.css
│   └── tracking.css                 # ⭐ NEW
├── js/
│   ├── app.js                       # 앱 초기화
│   ├── indexeddb.js                 # IndexedDB 관리
│   ├── process-executor.js          # 프로세스 실행
│   ├── file-handler.js              # JSON/파일 처리
│   ├── chatbot.js                   # AI 챗봇
│   ├── tracking.js                  # 추적 관리 ⭐ NEW
│   └── ui.js                        # UI 렌더링
├── vendor/
│   └── jszip.min.js
├── samples/
│   ├── processes/
│   │   ├── onboarding.json
│   │   ├── expense-report.json
│   │   └── leave-request.json
│   └── vector-stores/
│       ├── onboarding-vector.json
│       ├── expense-vector.json
│       └── leave-vector.json
└── README.md
```

---

### 3. 관리 대시보드 (Admin Dashboard) ⭐ NEW

**기술**: React + TypeScript + Chart.js

**주요 기능**:
- ZIP 파일 수집 및 분석
- 부서별/업무별/개인별 통계
- 병목 단계 분석 (평균 소요 시간, 표준편차)
- 마감일 관리 및 알림
- 월간/분기별 리포트 생성

**대시보드 화면**:
```
┌──────────────────────────────────────────────────────┐
│  관리 대시보드                                        │
├──────────────────────────────────────────────────────┤
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐               │
│  │전체업무││진행중 ││ 지연  ││완료율 │               │
│  │ 127  ││  45  ││   8  ││ 64% │               │
│  └──────┘ └──────┘ └──────┘ └──────┘               │
│                                                      │
│  부서별 현황:                                        │
│  ┌──────────────────────────────────────────────┐  │
│  │ 부서  │전체│진행│완료│지연│완료율│           │  │
│  ├──────────────────────────────────────────────┤  │
│  │ 인사  │ 45 │ 25 │ 15 │  3 │ 33% │           │  │
│  │ IT    │ 32 │ 12 │ 18 │  2 │ 56% │           │  │
│  │ 영업  │ 28 │ 10 │ 16 │  2 │ 57% │           │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  병목 단계 분석:                                     │
│  ┌──────────────────────────────────────────────┐  │
│  │ step-3: 예산 근거 작성 (평균 2시간)          │  │
│  │ ████████████░░░░░░░░░░░░  60%                │  │
│  │ step-2: 항목 작성 (평균 1시간)               │  │
│  │ ██████░░░░░░░░░░░░░░░░░░  30%                │  │
│  └──────────────────────────────────────────────┘  │
│                                                      │
│  최근 활동:                                          │
│  • 홍길동님이 "온보딩" 완료 (2시간 소요)            │
│  • 김철수님이 "예산신청" step-3 진행 중             │
│  • 이영희님의 "휴가신청" 마감 1일 전 ⚠️            │
└──────────────────────────────────────────────────────┘
```

---

## 📊 데이터 구조

### 프로세스 템플릿 JSON

```json
{
  "id": "PROC-20260104-0001",
  "name": "신입사원 온보딩",
  "version": "1.0.0",
  "icon": "👋",
  "description": "신입사원 입사 프로세스",

  // ⭐ 추적 관리 정보 (NEW)
  "tracking": {
    "organizationId": "CORP-2026",
    "departmentId": "DEPT-HR",
    "departmentName": "인사팀",
    "processType": "ONBOARDING",
    "processCategory": "신규입사",
    "priority": "high",
    "assignedTo": "USER-12345",
    "assignedToName": "홍길동",
    "assignedToEmail": "hong@example.com",
    "createdBy": "ADMIN-001",
    "createdByName": "관리자",
    "createdAt": "2026-01-04T10:30:00Z",
    "dueDate": "2026-01-11T17:00:00Z",
    "estimatedHours": 8,
    "tags": ["신입사원", "2026년1월"],
    "notes": "2026년 1월 신입사원 5명 동시 온보딩"
  },

  "steps": [
    {
      "id": "step-1",
      "title": "개인정보 입력",
      "description": "기본 개인 정보를 입력하세요",
      "checklist": [
        {
          "id": "check-1",
          "text": "이름 확인",
          "required": true
        },
        {
          "id": "check-2",
          "text": "연락처 확인",
          "required": true
        }
      ],
      "fields": [
        {
          "id": "field-1",
          "type": "text",
          "label": "이름",
          "required": true,
          "validation": {
            "minLength": 2,
            "maxLength": 50
          }
        },
        {
          "id": "field-2",
          "type": "text",
          "label": "이메일",
          "required": true,
          "validation": {
            "pattern": "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
          }
        },
        {
          "id": "field-3",
          "type": "file",
          "label": "이력서",
          "required": true,
          "validation": {
            "accept": ".pdf,.docx",
            "maxSize": 10485760
          }
        }
      ]
    },
    {
      "id": "step-2",
      "title": "서류 제출",
      "description": "필요한 서류를 제출하세요",
      "checklist": [
        {
          "id": "check-3",
          "text": "주민등록등본 준비",
          "required": true
        }
      ],
      "fields": [
        {
          "id": "field-4",
          "type": "file",
          "label": "주민등록등본",
          "required": true,
          "validation": {
            "accept": ".pdf,.jpg,.png",
            "maxSize": 5242880
          }
        }
      ]
    },
    {
      "id": "step-3",
      "title": "완료",
      "description": "온보딩이 완료되었습니다!",
      "checklist": [],
      "fields": []
    }
  ]
}
```

### 진행 상황 JSON

```json
{
  "id": "PROG-1735987200000",
  "processId": "PROC-20260104-0001",

  // 추적 정보 (프로세스에서 복사)
  "tracking": {
    "organizationId": "CORP-2026",
    "departmentId": "DEPT-HR",
    "departmentName": "인사팀",
    "assignedTo": "USER-12345",
    "assignedToName": "홍길동",
    "dueDate": "2026-01-11T17:00:00Z",
    "priority": "high"
  },

  // ⭐ 진행 상황 (NEW)
  "progress": {
    "status": "in_progress",
    "currentStepId": "step-2",
    "completedSteps": ["step-1"],
    "startedAt": "2026-01-04T11:00:00Z",
    "lastUpdated": "2026-01-04T14:30:00Z",
    "completedAt": null,
    "timeSpent": 12600,
    "stepDurations": {
      "step-1": 7200,
      "step-2": 5400
    },
    "isOverdue": false,
    "daysUntilDue": 7,
    "logs": [
      {
        "id": "log-1",
        "timestamp": "2026-01-04T11:00:00Z",
        "action": "process_started",
        "stepId": null,
        "userId": "USER-12345",
        "userName": "홍길동"
      },
      {
        "id": "log-2",
        "timestamp": "2026-01-04T13:00:00Z",
        "action": "step_completed",
        "stepId": "step-1",
        "userId": "USER-12345",
        "userName": "홍길동",
        "metadata": {
          "duration": 7200,
          "checklistCompleted": 2,
          "fieldsSubmitted": 3
        }
      }
    ]
  },

  // 단계별 데이터
  "stepData": {
    "step-1": {
      "checklist": ["check-1", "check-2"],
      "fields": {
        "field-1": "홍길동",
        "field-2": "hong@example.com",
        "field-3": {
          "fileId": "file-abc123",
          "name": "resume.pdf",
          "size": 1048576,
          "type": "application/pdf"
        }
      }
    }
  }
}
```

---

## 🔧 IndexedDB 스키마

```javascript
const DB_NAME = 'ProcessExecutorDB';
const DB_VERSION = 2;  // v2: 추적 관리 추가

// 스토어 목록:
// 1. processes      - 프로세스 템플릿
// 2. progresses     - 진행 상황
// 3. files          - 첨부 파일 (Blob)
// 4. logs           - 변경 이력 ⭐ NEW
// 5. notifications  - 알림 ⭐ NEW

function onupgradeneeded(event) {
  const db = event.target.result;

  // 1. processes (프로세스 템플릿)
  if (!db.objectStoreNames.contains('processes')) {
    const processStore = db.createObjectStore('processes', {
      keyPath: 'id'
    });
    processStore.createIndex('name', 'name', { unique: false });
    processStore.createIndex('departmentId', 'tracking.departmentId', {
      unique: false
    });
  }

  // 2. progresses (진행 상황)
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

  // 3. files (첨부 파일)
  if (!db.objectStoreNames.contains('files')) {
    const fileStore = db.createObjectStore('files', {
      keyPath: 'id'
    });
    fileStore.createIndex('progressId', 'progressId', {
      unique: false
    });
  }

  // 4. logs (변경 이력) ⭐ NEW
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
    logStore.createIndex('userId', 'userId', {
      unique: false
    });
  }

  // 5. notifications (알림) ⭐ NEW
  if (!db.objectStoreNames.contains('notifications')) {
    const notifStore = db.createObjectStore('notifications', {
      keyPath: 'id'
    });
    notifStore.createIndex('userId', 'userId', {
      unique: false
    });
    notifStore.createIndex('readAt', 'readAt', {
      unique: false
    });
  }
}
```

---

## 🤖 AI 챗봇 (LibreChat + Ollama)

### 아키텍처

```
사용자 질문
   ↓
1. 벡터 검색 (js/chatbot.js)
   ↓ 코사인 유사도로 관련 문서 찾기
   ↓ Top 3 결과 추출
2. LibreChat iframe에 컨텍스트 전달
   ↓ postMessage API
3. Ollama LLM 호출
   ↓ 로컬 모델 (llama2, mistral 등)
4. 답변 생성
   ↓
사용자에게 표시
```

### LibreChat 설정

```bash
# Docker로 LibreChat 실행
docker run -d \
  -p 3000:3000 \
  -e OLLAMA_BASE_URL=http://host.docker.internal:11434 \
  -v librechat_data:/app/client/public/images \
  --name librechat \
  ghcr.io/danny-avila/librechat:latest

# Ollama 실행 (별도 터미널)
ollama serve

# 모델 다운로드
ollama pull llama2
```

### 통합 코드

```html
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
```

```javascript
// js/chatbot.js
async function handleUserQuestion(question) {
  // 1. 벡터 검색
  const relevantDocs = await vectorSearch.search(question, 3);
  const context = relevantDocs.map(doc => doc.text).join('\n\n');

  // 2. LibreChat에 전달
  const iframe = document.getElementById('chatbot-iframe');
  iframe.contentWindow.postMessage({
    type: 'chat',
    message: question,
    context: context
  }, 'http://localhost:3000');
}
```

---

## 📅 개발 로드맵

### Phase 1: 기본 UI (4시간)
- [ ] 관리자 빌더: React Flow 캔버스 설정
- [ ] 사용자 실행기: HTML/CSS 레이아웃
- [ ] JSON 가져오기/내보내기

### Phase 2: 프로세스 실행 (6시간)
- [ ] 노드 타입 구현 (시작/작업/조건/종료)
- [ ] 체크리스트 실행
- [ ] 폼 필드 입력 및 검증
- [ ] IndexedDB 저장

### Phase 3: 파일 처리 (3시간)
- [ ] 파일 업로드 (Blob 저장)
- [ ] 파일 다운로드
- [ ] ZIP 생성 (JSZip)

### Phase 4: 추적 관리 (6시간) ⭐ NEW
- [ ] ID 생성 시스템 (조직/부서/사용자/프로세스/진행)
- [ ] 진행 상황 로깅
- [ ] 변경 이력 추적
- [ ] 마감일 관리
- [ ] 알림 시스템

### Phase 5: AI 챗봇 (6시간)
- [ ] LibreChat Docker 설정
- [ ] Ollama 연동
- [ ] 벡터 검색 구현
- [ ] iframe 통합

### Phase 6: 관리 대시보드 (5시간) ⭐ NEW
- [ ] ZIP 파일 수집 및 파싱
- [ ] 부서별/업무별 통계
- [ ] 병목 단계 분석
- [ ] 차트 시각화 (Chart.js)
- [ ] 리포트 생성

### Phase 7: 테스트 및 문서화 (3시간)
- [ ] 샘플 프로세스 3개 생성
- [ ] 사용자 매뉴얼
- [ ] 배포 스크립트

**총 예상 시간**: 33시간 (v1.0: 28시간 → v2.0: +5시간)

---

## 🚀 빠른 시작

### 관리자 (프로세스 생성)

```bash
cd admin-builder
npm install
npm run dev
```

1. 브라우저에서 `http://localhost:5173` 접속
2. 드래그 앤 드롭으로 프로세스 생성
3. 추적 관리 정보 설정 (부서/담당자/마감일)
4. "Export" 버튼으로 JSON + Vector Store 다운로드
5. 사용자에게 이메일/공유 폴더로 배포

### 사용자 (프로세스 실행)

**Windows**:
```bash
cd user-executor
start.bat
```

**Mac/Linux**:
```bash
cd user-executor
chmod +x start.sh
./start.sh
```

1. 브라우저에서 `http://localhost:8000` 접속
2. JSON 파일 로드 (드래그 앤 드롭)
3. 단계별로 업무 진행
4. AI 챗봇 활용 (궁금한 점 질의)
5. 완료 후 ZIP 다운로드 → 관리자에게 제출

### 관리자 (대시보드)

```bash
cd admin-dashboard
npm install
npm run dev
```

1. 브라우저에서 `http://localhost:5174` 접속
2. 사용자가 제출한 ZIP 파일 업로드
3. 통계 및 분석 확인
4. 월간 리포트 생성

---

## 📊 샘플 프로세스

### 1. 신입사원 온보딩

**단계**:
1. 개인정보 입력 (이름, 이메일, 이력서)
2. 서류 제출 (주민등록등본, 졸업증명서)
3. 장비 신청 (노트북, 모니터)
4. 교육 일정 확인
5. 완료

**예상 소요 시간**: 2시간
**부서**: 인사팀
**우선순위**: 높음

---

### 2. 예산 신청

**단계**:
1. 예산 항목 작성 (인건비, 운영비, 기타)
2. 예산 근거 서류 첨부
3. 부서장 승인 (조건 분기: 1천만원 이상 → 임원 승인)
4. 재무팀 검토
5. 완료

**예상 소요 시간**: 4시간
**부서**: 재무팀
**우선순위**: 보통

---

### 3. 휴가 신청

**단계**:
1. 휴가 유형 선택 (연차, 병가, 경조사)
2. 휴가 기간 입력
3. 업무 인수인계 계획
4. 팀장 승인
5. 완료

**예상 소요 시간**: 30분
**부서**: 전체
**우선순위**: 낮음

---

## 🔧 기술 스택

### 관리자 빌더
- **프레임워크**: React 19 + TypeScript
- **UI**: React Flow 11, TailwindCSS
- **상태 관리**: Zustand
- **빌드**: Vite

### 사용자 실행기
- **언어**: Vanilla JavaScript (ES6+)
- **스타일**: CSS3 (Flexbox, Grid)
- **로컬 저장**: IndexedDB
- **파일 압축**: JSZip

### 관리 대시보드
- **프레임워크**: React 19 + TypeScript
- **차트**: Chart.js
- **UI**: TailwindCSS

### AI 챗봇
- **UI**: LibreChat (MIT 라이선스)
- **LLM**: Ollama (로컬)
- **벡터 검색**: 코사인 유사도

---

## 📦 배포

### 폴더 패키징

```
business-process-executor.zip
├── admin-builder/           # 관리자 빌더 (npm 설치 필요)
├── user-executor/           # 사용자 실행기 (바로 실행 가능)
├── admin-dashboard/         # 관리 대시보드 (npm 설치 필요)
├── README.md                # 프로젝트 개요
├── SETUP.md                 # 설치 가이드
└── ARCHITECTURE.md          # 아키텍처 문서
```

### 사용자에게 배포

**방법 1: 이메일**
```
제목: [업무 프로세스] 신입사원 온보딩
첨부: process-onboarding.zip
      ├── process-onboarding.json
      └── vector-onboarding.json
```

**방법 2: 공유 폴더**
```
\\company-server\processes\
├── onboarding\
│   ├── process.json
│   └── vector.json
├── expense-report\
└── leave-request\
```

---

## 🔒 보안 고려사항

### 1. XSS 방지
```javascript
function sanitizeInput(input) {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}
```

### 2. 파일 검증
```javascript
const ALLOWED_TYPES = ['.pdf', '.xlsx', '.docx', '.jpg', '.png'];
const MAX_FILE_SIZE = 10 * 1024 * 1024;  // 10MB

function validateFile(file, field) {
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  if (!field.validation.accept.includes(ext)) {
    throw new Error(`허용되지 않은 파일 형식: ${ext}`);
  }
  if (file.size > field.validation.maxSize) {
    throw new Error(`파일 크기 초과: ${file.size} > ${field.validation.maxSize}`);
  }
}
```

### 3. IndexedDB Blob 사용
```javascript
// ❌ 보안 위험
{ "file": { "base64": "..." } }

// ✅ 안전
{ "file": { "fileId": "file-abc123" } }
```

---

## 🎯 확장 가능성

### 데스크톱 앱 전환 (Tauri)

```bash
npm install -D @tauri-apps/cli
npx tauri init
npm run tauri build
```

**예상 시간**: +4시간
**결과**: 3-10MB 설치 파일

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
```

---

## 📚 문서

- [README.md](../README.md) - 프로젝트 개요
- [ARCHITECTURE.md](../ARCHITECTURE.md) - 시스템 아키텍처
- [TRACKING_SYSTEM.md](./TRACKING_SYSTEM.md) - 추적 관리 시스템 ⭐ NEW
- [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) - 관리자 가이드
- [USER_GUIDE.md](./USER_GUIDE.md) - 사용자 가이드
- [API_REFERENCE.md](./API_REFERENCE.md) - API 레퍼런스
- [DEVELOPMENT.md](./DEVELOPMENT.md) - 개발자 가이드

---

**작성일**: 2026-01-04
**버전**: 2.0.0
**작성자**: Claude (Sonnet 4.5)
**변경사항**: 추적 관리 시스템 추가 (부서/업무별 ID, 진행 상황 추적, 관리 대시보드)
