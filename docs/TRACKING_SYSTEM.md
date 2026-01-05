# 📊 추적 관리 시스템 (Tracking System)

## 🎯 개요

업무 프로세스 실행 시스템의 추적 관리 기능은 **부서별/업무별 ID 부여** 및 **진행 상황 추적**을 제공합니다.

**주요 목적**:
- 업무 진행 상황 실시간 파악
- 부서별/담당자별 업무량 관리
- 병목 단계 분석 및 개선
- 마감일 관리 및 알림
- 완료 이력 추적

---

## 🆔 ID 체계

### 1. 조직 ID (Organization ID)

**형식**: `CORP-YYYY`

**예시**:
- `CORP-2026`: 2026년 조직

**생성 규칙**:
```javascript
function generateOrganizationId() {
  const year = new Date().getFullYear();
  return `CORP-${year}`;
}
```

---

### 2. 부서 ID (Department ID)

**형식**: `DEPT-{CODE}`

**예시**:
- `DEPT-HR`: 인사팀
- `DEPT-IT`: IT팀
- `DEPT-SALES`: 영업팀
- `DEPT-FIN`: 재무팀

**부서 코드 매핑**:
```javascript
const DEPARTMENT_CODES = {
  'HR': '인사팀',
  'IT': 'IT팀',
  'SALES': '영업팀',
  'FIN': '재무팀',
  'MKT': '마케팅팀',
  'OPS': '운영팀',
  'CS': '고객서비스팀'
};

function generateDepartmentId(code) {
  return `DEPT-${code.toUpperCase()}`;
}
```

---

### 3. 사용자 ID (User ID)

**형식**: `USER-{5자리숫자}`

**예시**:
- `USER-00001`: 첫 번째 사용자
- `USER-12345`: 12,345번째 사용자

**생성 규칙**:
```javascript
function generateUserId(sequenceNumber) {
  const num = sequenceNumber.toString().padStart(5, '0');
  return `USER-${num}`;
}

// 또는 랜덤 생성
function generateRandomUserId() {
  const num = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `USER-${num}`;
}
```

---

### 4. 프로세스 ID (Process ID)

**형식**: `PROC-{YYYYMMDD}-{4자리숫자}`

**예시**:
- `PROC-20260104-0001`: 2026년 1월 4일 첫 번째 프로세스
- `PROC-20260104-0042`: 2026년 1월 4일 42번째 프로세스

**생성 규칙**:
```javascript
function generateProcessId() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const num = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `PROC-${date}-${num}`;
}
```

---

### 5. 진행 ID (Progress ID)

**형식**: `PROG-{timestamp}`

**예시**:
- `PROG-1735987200000`: Unix timestamp 기반

**생성 규칙**:
```javascript
function generateProgressId() {
  return `PROG-${Date.now()}`;
}
```

---

## 📋 데이터 구조

### 프로세스 추적 정보 (Process Tracking)

```json
{
  "id": "PROC-20260104-0001",
  "name": "신입사원 온보딩",
  "version": "1.0.0",
  "tracking": {
    // === 조직 정보 ===
    "organizationId": "CORP-2026",
    "departmentId": "DEPT-HR",
    "departmentName": "인사팀",

    // === 업무 정보 ===
    "processType": "ONBOARDING",           // 업무 유형 코드
    "processCategory": "신규입사",          // 업무 분류
    "priority": "high",                    // low/medium/high/urgent

    // === 담당자 정보 ===
    "assignedTo": "USER-12345",
    "assignedToName": "홍길동",
    "assignedToEmail": "hong@example.com",
    "assignedToPhone": "010-1234-5678",    // 선택적

    // === 생성자 정보 ===
    "createdBy": "ADMIN-001",
    "createdByName": "관리자",
    "createdByEmail": "admin@example.com",
    "createdAt": "2026-01-04T10:30:00Z",

    // === 기한 정보 ===
    "dueDate": "2026-01-11T17:00:00Z",     // 마감일
    "estimatedHours": 8,                    // 예상 소요 시간 (시간)
    "reminderDays": [3, 1],                 // 마감 N일 전 알림

    // === 태그 (검색/필터링) ===
    "tags": ["신입사원", "2026년1월", "긴급"],

    // === 참조 정보 ===
    "relatedProcesses": [                   // 관련 프로세스
      "PROC-20260103-0042"
    ],
    "parentProcessId": null,                // 상위 프로세스 (서브 프로세스인 경우)

    // === 메모 ===
    "notes": "2026년 1월 신입사원 5명 동시 온보딩"
  },
  "steps": [
    // ... 프로세스 단계
  ]
}
```

---

### 진행 상황 추적 (Progress Tracking)

```json
{
  "id": "PROG-1735987200000",
  "processId": "PROC-20260104-0001",

  // === 추적 정보 (프로세스에서 복사) ===
  "tracking": {
    "organizationId": "CORP-2026",
    "departmentId": "DEPT-HR",
    "departmentName": "인사팀",
    "assignedTo": "USER-12345",
    "assignedToName": "홍길동",
    "dueDate": "2026-01-11T17:00:00Z",
    "priority": "high"
  },

  // === 진행 상황 ===
  "progress": {
    // 상태
    "status": "in_progress",                // draft/in_progress/completed/archived

    // 현재 위치
    "currentStepId": "step-3",
    "completedSteps": ["step-1", "step-2"],
    "totalSteps": 5,
    "completionRate": 0.4,                  // 40% 완료

    // 시간 정보
    "startedAt": "2026-01-04T11:00:00Z",
    "lastUpdated": "2026-01-04T14:30:00Z",
    "completedAt": null,
    "timeSpent": 12600,                     // 총 소요 시간 (초)

    // 각 단계별 소요 시간
    "stepDurations": {
      "step-1": 3600,   // 1시간
      "step-2": 5400,   // 1.5시간
      "step-3": 3600    // 진행 중
    },

    // 마감일 관련
    "isOverdue": false,
    "daysUntilDue": 7,
    "remindersSent": [
      "2026-01-08T09:00:00Z"  // 3일 전 알림 발송
    ],

    // 변경 이력
    "logs": [
      {
        "id": "log-1",
        "timestamp": "2026-01-04T11:00:00Z",
        "action": "process_started",
        "stepId": null,
        "userId": "USER-12345",
        "userName": "홍길동",
        "metadata": {
          "ip": "192.168.1.100",
          "userAgent": "Mozilla/5.0..."
        }
      },
      {
        "id": "log-2",
        "timestamp": "2026-01-04T12:00:00Z",
        "action": "step_completed",
        "stepId": "step-1",
        "userId": "USER-12345",
        "userName": "홍길동",
        "metadata": {
          "duration": 3600,
          "checklistCompleted": 3,
          "fieldsSubmitted": 2
        }
      },
      {
        "id": "log-3",
        "timestamp": "2026-01-04T13:30:00Z",
        "action": "step_completed",
        "stepId": "step-2",
        "userId": "USER-12345",
        "userName": "홍길동",
        "metadata": {
          "duration": 5400,
          "filesUploaded": 2
        }
      },
      {
        "id": "log-4",
        "timestamp": "2026-01-04T14:00:00Z",
        "action": "step_started",
        "stepId": "step-3",
        "userId": "USER-12345",
        "userName": "홍길동",
        "metadata": {}
      }
    ]
  },

  // === 단계별 데이터 ===
  "stepData": {
    "step-1": {
      "checklist": ["check-1", "check-2", "check-3"],
      "fields": {
        "field-1": "홍길동",
        "field-2": {
          "fileId": "file-abc123",
          "name": "resume.pdf",
          "size": 1048576
        }
      }
    },
    "step-2": {
      // ...
    }
  }
}
```

---

## 📊 통계 및 분석

### 1. 부서별 통계

```javascript
async function getDepartmentStats(departmentId) {
  const db = await initDB();
  const tx = db.transaction(['progresses'], 'readonly');
  const store = tx.objectStore('progresses');

  // 부서별 진행 상황 조회
  const allProgresses = await store.getAll();
  const deptProgresses = allProgresses.filter(
    p => p.tracking.departmentId === departmentId
  );

  // 통계 계산
  const stats = {
    // 개수
    total: deptProgresses.length,
    draft: deptProgresses.filter(p => p.progress.status === 'draft').length,
    inProgress: deptProgresses.filter(p => p.progress.status === 'in_progress').length,
    completed: deptProgresses.filter(p => p.progress.status === 'completed').length,
    overdue: deptProgresses.filter(p => p.progress.isOverdue).length,

    // 시간
    avgTimeSpent: calculateAvgTime(deptProgresses),
    totalTimeSpent: deptProgresses.reduce((sum, p) => sum + p.progress.timeSpent, 0),

    // 우선순위별
    byPriority: {
      urgent: deptProgresses.filter(p => p.tracking.priority === 'urgent').length,
      high: deptProgresses.filter(p => p.tracking.priority === 'high').length,
      medium: deptProgresses.filter(p => p.tracking.priority === 'medium').length,
      low: deptProgresses.filter(p => p.tracking.priority === 'low').length
    },

    // 완료율
    completionRate: deptProgresses.filter(p => p.progress.status === 'completed').length / deptProgresses.length
  };

  return stats;
}

function calculateAvgTime(progresses) {
  const completed = progresses.filter(p => p.progress.status === 'completed');
  if (completed.length === 0) return 0;

  const total = completed.reduce((sum, p) => sum + p.progress.timeSpent, 0);
  return total / completed.length;
}
```

**결과 예시**:
```json
{
  "total": 45,
  "draft": 5,
  "inProgress": 25,
  "completed": 15,
  "overdue": 3,
  "avgTimeSpent": 21600,        // 6시간
  "totalTimeSpent": 324000,     // 90시간
  "byPriority": {
    "urgent": 2,
    "high": 10,
    "medium": 20,
    "low": 13
  },
  "completionRate": 0.33        // 33%
}
```

---

### 2. 업무별 통계

```javascript
async function getProcessTypeStats(processType) {
  const db = await initDB();
  const tx = db.transaction(['progresses'], 'readonly');
  const store = tx.objectStore('progresses');

  const allProgresses = await store.getAll();
  const typeProgresses = allProgresses.filter(
    p => p.tracking.processType === processType
  );

  return {
    total: typeProgresses.length,
    completed: typeProgresses.filter(p => p.progress.status === 'completed').length,
    avgTimeSpent: calculateAvgTime(typeProgresses),
    bottlenecks: await analyzeBottlenecks(typeProgresses)
  };
}
```

---

### 3. 병목 단계 분석

```javascript
async function analyzeBottlenecks(progresses) {
  const stepDurations = {};

  for (const progress of progresses) {
    for (const [stepId, duration] of Object.entries(progress.progress.stepDurations || {})) {
      if (!stepDurations[stepId]) {
        stepDurations[stepId] = [];
      }
      stepDurations[stepId].push(duration);
    }
  }

  // 평균, 최대, 최소 계산
  const result = {};
  for (const [stepId, durations] of Object.entries(stepDurations)) {
    const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
    result[stepId] = {
      count: durations.length,
      avgDuration: avg,
      maxDuration: Math.max(...durations),
      minDuration: Math.min(...durations),
      stdDev: calculateStdDev(durations)
    };
  }

  // 평균 소요 시간 기준 정렬 (병목 단계 우선)
  const sorted = Object.entries(result)
    .sort((a, b) => b[1].avgDuration - a[1].avgDuration);

  return Object.fromEntries(sorted);
}

function calculateStdDev(values) {
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / values.length;
  return Math.sqrt(variance);
}
```

**결과 예시**:
```json
{
  "step-3": {
    "count": 42,
    "avgDuration": 7200,      // 2시간 (병목!)
    "maxDuration": 14400,     // 4시간
    "minDuration": 3600,      // 1시간
    "stdDev": 2400            // 편차 크다 = 사람마다 차이 큼
  },
  "step-2": {
    "count": 42,
    "avgDuration": 3600,      // 1시간
    "maxDuration": 5400,
    "minDuration": 1800,
    "stdDev": 900
  },
  "step-1": {
    "count": 42,
    "avgDuration": 1800,      // 30분
    "maxDuration": 3600,
    "minDuration": 900,
    "stdDev": 600
  }
}
```

**해석**:
- `step-3`이 평균 2시간으로 가장 오래 걸림 → **병목 단계**
- 표준편차가 2400초(40분)로 커서 사람마다 편차 큼 → **가이드 보강 필요**

---

### 4. 개인별 통계

```javascript
async function getUserStats(userId) {
  const db = await initDB();
  const tx = db.transaction(['progresses'], 'readonly');
  const store = tx.objectStore('progresses');
  const index = store.index('assignedTo');

  const userProgresses = await index.getAll(userId);

  return {
    total: userProgresses.length,
    inProgress: userProgresses.filter(p => p.progress.status === 'in_progress').length,
    completed: userProgresses.filter(p => p.progress.status === 'completed').length,
    overdue: userProgresses.filter(p => p.progress.isOverdue).length,
    avgCompletionRate: calculateAvgCompletionRate(userProgresses),
    avgTimeSpent: calculateAvgTime(userProgresses.filter(p => p.progress.status === 'completed')),
    productivity: calculateProductivity(userProgresses)
  };
}

function calculateAvgCompletionRate(progresses) {
  if (progresses.length === 0) return 0;
  const total = progresses.reduce((sum, p) => sum + (p.progress.completionRate || 0), 0);
  return total / progresses.length;
}

function calculateProductivity(progresses) {
  const completed = progresses.filter(p => p.progress.status === 'completed');
  const totalDays = 30;  // 최근 30일
  return completed.length / totalDays;
}
```

---

## 🔔 알림 시스템

### 알림 유형

```typescript
type NotificationType =
  | 'due_soon'           // 마감 임박 (3일 전)
  | 'due_tomorrow'       // 내일 마감
  | 'overdue'            // 마감일 초과
  | 'step_blocked'       // 단계 지연 (평균보다 2배 이상 소요)
  | 'assigned'           // 새 업무 배정
  | 'completed';         // 업무 완료

interface Notification {
  id: string;
  type: NotificationType;
  progressId: string;
  userId: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  readAt: string | null;
  actionUrl: string;
}
```

### 알림 생성 로직

```javascript
class NotificationManager {
  async checkDueSoon() {
    const db = await initDB();
    const tx = db.transaction(['progresses'], 'readonly');
    const store = tx.objectStore('progresses');
    const progresses = await store.getAll();

    const now = new Date();
    const notifications = [];

    for (const progress of progresses) {
      if (progress.progress.status === 'completed') continue;

      const dueDate = new Date(progress.tracking.dueDate);
      const daysUntilDue = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

      // 마감 3일 전
      if (daysUntilDue === 3 && !progress.progress.remindersSent?.includes('3days')) {
        notifications.push({
          id: `notif-${Date.now()}`,
          type: 'due_soon',
          progressId: progress.id,
          userId: progress.tracking.assignedTo,
          title: '마감 3일 전',
          message: `${progress.tracking.processCategory} 업무가 3일 후 마감됩니다`,
          priority: 'medium',
          createdAt: now.toISOString(),
          readAt: null,
          actionUrl: `/process/${progress.id}`
        });

        progress.progress.remindersSent = [...(progress.progress.remindersSent || []), '3days'];
        await this.updateProgress(progress);
      }

      // 마감 1일 전
      if (daysUntilDue === 1 && !progress.progress.remindersSent?.includes('1day')) {
        notifications.push({
          id: `notif-${Date.now()}`,
          type: 'due_tomorrow',
          progressId: progress.id,
          userId: progress.tracking.assignedTo,
          title: '내일 마감!',
          message: `${progress.tracking.processCategory} 업무가 내일 마감됩니다`,
          priority: 'high',
          createdAt: now.toISOString(),
          readAt: null,
          actionUrl: `/process/${progress.id}`
        });

        progress.progress.remindersSent = [...(progress.progress.remindersSent || []), '1day'];
        await this.updateProgress(progress);
      }

      // 마감일 초과
      if (daysUntilDue < 0 && !progress.progress.isOverdue) {
        notifications.push({
          id: `notif-${Date.now()}`,
          type: 'overdue',
          progressId: progress.id,
          userId: progress.tracking.assignedTo,
          title: '마감일 초과!',
          message: `${progress.tracking.processCategory} 업무가 ${Math.abs(daysUntilDue)}일 지연되었습니다`,
          priority: 'urgent',
          createdAt: now.toISOString(),
          readAt: null,
          actionUrl: `/process/${progress.id}`
        });

        progress.progress.isOverdue = true;
        await this.updateProgress(progress);
      }
    }

    return notifications;
  }

  async sendNotifications(notifications) {
    // 브라우저 알림
    for (const notif of notifications) {
      if (Notification.permission === 'granted') {
        new Notification(notif.title, {
          body: notif.message,
          icon: '/icon.png',
          tag: notif.id
        });
      }
    }

    // DB에 저장
    const db = await initDB();
    const tx = db.transaction(['notifications'], 'readwrite');
    const store = tx.objectStore('notifications');

    for (const notif of notifications) {
      await store.add(notif);
    }
  }
}

// 주기적 체크 (10분마다)
setInterval(async () => {
  const manager = new NotificationManager();
  const notifications = await manager.checkDueSoon();
  if (notifications.length > 0) {
    await manager.sendNotifications(notifications);
  }
}, 10 * 60 * 1000);
```

---

## 📈 관리 대시보드

### 대시보드 UI 구성

```html
<!-- 관리자 대시보드 -->
<div class="dashboard">
  <!-- 전체 통계 -->
  <div class="stats-overview">
    <div class="stat-card">
      <h3>전체 업무</h3>
      <div class="stat-number">127</div>
      <div class="stat-change">+12 (지난주)</div>
    </div>
    <div class="stat-card">
      <h3>진행 중</h3>
      <div class="stat-number">45</div>
      <div class="stat-change">-3</div>
    </div>
    <div class="stat-card alert">
      <h3>지연</h3>
      <div class="stat-number">8</div>
      <div class="stat-change">+2</div>
    </div>
    <div class="stat-card success">
      <h3>완료율</h3>
      <div class="stat-number">64%</div>
      <div class="stat-change">+5%</div>
    </div>
  </div>

  <!-- 부서별 통계 -->
  <div class="department-stats">
    <h2>부서별 현황</h2>
    <table>
      <thead>
        <tr>
          <th>부서</th>
          <th>전체</th>
          <th>진행 중</th>
          <th>완료</th>
          <th>지연</th>
          <th>완료율</th>
        </tr>
      </thead>
      <tbody id="dept-stats-body">
        <!-- 동적 생성 -->
      </tbody>
    </table>
  </div>

  <!-- 업무별 통계 -->
  <div class="process-type-stats">
    <h2>업무별 현황</h2>
    <div class="chart-container">
      <canvas id="process-type-chart"></canvas>
    </div>
  </div>

  <!-- 병목 단계 분석 -->
  <div class="bottleneck-analysis">
    <h2>병목 단계 분석</h2>
    <div class="bottleneck-list" id="bottleneck-list">
      <!-- 동적 생성 -->
    </div>
  </div>

  <!-- 최근 활동 -->
  <div class="recent-activity">
    <h2>최근 활동</h2>
    <div class="activity-feed" id="activity-feed">
      <!-- 동적 생성 -->
    </div>
  </div>
</div>
```

### 차트 생성 (Chart.js)

```javascript
async function renderDashboard() {
  // 부서별 통계 렌더링
  const deptStats = await getAllDepartmentStats();
  const tbody = document.getElementById('dept-stats-body');
  tbody.innerHTML = deptStats.map(dept => `
    <tr>
      <td>${dept.name}</td>
      <td>${dept.total}</td>
      <td>${dept.inProgress}</td>
      <td>${dept.completed}</td>
      <td class="${dept.overdue > 0 ? 'alert' : ''}">${dept.overdue}</td>
      <td>${(dept.completionRate * 100).toFixed(1)}%</td>
    </tr>
  `).join('');

  // 업무별 차트
  const processTypes = await getProcessTypeStats();
  const ctx = document.getElementById('process-type-chart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: processTypes.map(p => p.name),
      datasets: [{
        label: '평균 소요 시간 (시간)',
        data: processTypes.map(p => p.avgTimeSpent / 3600),
        backgroundColor: 'rgba(54, 162, 235, 0.5)'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });

  // 병목 단계
  const bottlenecks = await analyzeAllBottlenecks();
  const bottleneckList = document.getElementById('bottleneck-list');
  bottleneckList.innerHTML = Object.entries(bottlenecks)
    .slice(0, 5)  // Top 5
    .map(([stepId, stats]) => `
      <div class="bottleneck-item">
        <div class="step-name">${stepId}</div>
        <div class="step-stats">
          <span>평균 ${(stats.avgDuration / 3600).toFixed(1)}시간</span>
          <span>최대 ${(stats.maxDuration / 3600).toFixed(1)}시간</span>
          <span>편차 ${(stats.stdDev / 60).toFixed(0)}분</span>
        </div>
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${stats.avgDuration / stats.maxDuration * 100}%"></div>
        </div>
      </div>
    `).join('');
}
```

---

## 🔧 구현 가이드

### 1. 프로세스 생성 시 추적 정보 설정 (관리자)

```javascript
// admin-builder/src/components/sidebar/TrackingSettings.tsx
export function TrackingSettings() {
  const { tracking, updateTracking } = useProcessStore();

  return (
    <div className="tracking-settings">
      <h3>추적 관리 설정</h3>

      <label>
        부서
        <select
          value={tracking.departmentId}
          onChange={e => updateTracking({ departmentId: e.target.value })}>
          <option value="DEPT-HR">인사팀</option>
          <option value="DEPT-IT">IT팀</option>
          <option value="DEPT-SALES">영업팀</option>
          {/* ... */}
        </select>
      </label>

      <label>
        담당자 ID
        <input
          type="text"
          value={tracking.assignedTo}
          onChange={e => updateTracking({ assignedTo: e.target.value })}
          placeholder="USER-00001" />
      </label>

      <label>
        담당자 이름
        <input
          type="text"
          value={tracking.assignedToName}
          onChange={e => updateTracking({ assignedToName: e.target.value })} />
      </label>

      <label>
        마감일
        <input
          type="datetime-local"
          value={tracking.dueDate}
          onChange={e => updateTracking({ dueDate: e.target.value })} />
      </label>

      <label>
        우선순위
        <select
          value={tracking.priority}
          onChange={e => updateTracking({ priority: e.target.value })}>
          <option value="low">낮음</option>
          <option value="medium">보통</option>
          <option value="high">높음</option>
          <option value="urgent">긴급</option>
        </select>
      </label>
    </div>
  );
}
```

### 2. 진행 상황 로깅 (사용자)

```javascript
// user-executor/js/tracking.js
class TrackingLogger {
  constructor(progressId) {
    this.progressId = progressId;
  }

  async logAction(action, stepId, metadata = {}) {
    const log = {
      id: `log-${Date.now()}`,
      progressId: this.progressId,
      timestamp: new Date().toISOString(),
      action,
      stepId,
      userId: this.getCurrentUserId(),
      userName: this.getCurrentUserName(),
      metadata
    };

    // progresses의 logs 배열에 추가
    const db = await initDB();
    const tx = db.transaction(['progresses', 'logs'], 'readwrite');

    // 1. progresses 업데이트
    const progress = await tx.objectStore('progresses').get(this.progressId);
    progress.progress.logs.push(log);
    progress.progress.lastUpdated = log.timestamp;
    await tx.objectStore('progresses').put(progress);

    // 2. logs 스토어에도 저장 (검색 용이)
    await tx.objectStore('logs').add(log);

    return log;
  }

  async logStepStart(stepId) {
    return this.logAction('step_started', stepId, {
      timestamp: Date.now()
    });
  }

  async logStepComplete(stepId, duration) {
    return this.logAction('step_completed', stepId, {
      duration,
      checklistCompleted: this.getCompletedChecklistCount(stepId),
      fieldsSubmitted: this.getSubmittedFieldsCount(stepId)
    });
  }

  getCurrentUserId() {
    // 실제로는 로그인 정보에서 가져옴
    return localStorage.getItem('userId') || 'USER-00000';
  }

  getCurrentUserName() {
    return localStorage.getItem('userName') || '익명';
  }
}
```

---

## 📊 리포트 생성

### 월간 리포트

```javascript
async function generateMonthlyReport(year, month) {
  const db = await initDB();
  const tx = db.transaction(['progresses'], 'readonly');
  const store = tx.objectStore('progresses');
  const allProgresses = await store.getAll();

  // 해당 월 필터링
  const monthProgresses = allProgresses.filter(p => {
    const startedAt = new Date(p.progress.startedAt);
    return startedAt.getFullYear() === year && startedAt.getMonth() === month - 1;
  });

  const report = {
    period: `${year}-${month.toString().padStart(2, '0')}`,
    summary: {
      total: monthProgresses.length,
      completed: monthProgresses.filter(p => p.progress.status === 'completed').length,
      inProgress: monthProgresses.filter(p => p.progress.status === 'in_progress').length,
      overdue: monthProgresses.filter(p => p.progress.isOverdue).length,
      completionRate: 0,
      avgTimeSpent: 0
    },
    byDepartment: {},
    byProcessType: {},
    topPerformers: [],
    bottlenecks: {}
  };

  // 완료율
  report.summary.completionRate =
    report.summary.completed / report.summary.total;

  // 평균 소요 시간
  const completed = monthProgresses.filter(p => p.progress.status === 'completed');
  report.summary.avgTimeSpent =
    completed.reduce((sum, p) => sum + p.progress.timeSpent, 0) / completed.length;

  // 부서별 통계
  const departments = [...new Set(monthProgresses.map(p => p.tracking.departmentId))];
  for (const deptId of departments) {
    const deptProgresses = monthProgresses.filter(p => p.tracking.departmentId === deptId);
    report.byDepartment[deptId] = await getDepartmentStats(deptId);
  }

  // 업무별 통계
  const processTypes = [...new Set(monthProgresses.map(p => p.tracking.processType))];
  for (const type of processTypes) {
    report.byProcessType[type] = await getProcessTypeStats(type);
  }

  // Top Performers (완료 건수 기준)
  const userStats = {};
  for (const progress of completed) {
    const userId = progress.tracking.assignedTo;
    if (!userStats[userId]) {
      userStats[userId] = {
        userId,
        userName: progress.tracking.assignedToName,
        completed: 0,
        avgTimeSpent: 0,
        totalTimeSpent: 0
      };
    }
    userStats[userId].completed++;
    userStats[userId].totalTimeSpent += progress.progress.timeSpent;
  }

  for (const stats of Object.values(userStats)) {
    stats.avgTimeSpent = stats.totalTimeSpent / stats.completed;
  }

  report.topPerformers = Object.values(userStats)
    .sort((a, b) => b.completed - a.completed)
    .slice(0, 10);

  // 병목 단계
  report.bottlenecks = await analyzeBottlenecks(monthProgresses);

  return report;
}

// 리포트 다운로드
async function downloadMonthlyReport(year, month) {
  const report = await generateMonthlyReport(year, month);

  // JSON 다운로드
  const blob = new Blob([JSON.stringify(report, null, 2)], {
    type: 'application/json'
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `monthly-report-${year}-${month}.json`;
  a.click();
}
```

---

**작성일**: 2026-01-04
**버전**: 2.0.0
**작성자**: Claude (Sonnet 4.5)
