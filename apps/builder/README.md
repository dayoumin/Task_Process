# Admin Builder - 프로세스 빌더

React Flow 기반 드래그 앤 드롭 업무 프로세스 생성 도구입니다.

User Executor와 완벽하게 호환되는 JSON 파일을 생성합니다.

## 주요 기능

- ✅ **드래그 앤 드롭 캔버스**: React Flow 기반 직관적인 UI
- ✅ **4가지 노드 타입**: 시작/작업/조건/종료 노드
- ✅ **체크리스트 & 폼 필드**: 각 작업 노드에 체크리스트와 입력 필드 추가
- ✅ **추적 관리 설정**: 부서, 담당자, 우선순위, 마감일 등 설정
- ✅ **JSON 내보내기**: User Executor 호환 JSON 파일 생성
- ✅ **실시간 검증**: 노드 연결, 순환 참조, 필수 항목 자동 검증

## 빠른 시작

### 1. 의존성 설치 (최초 1회)
```bash
# 루트에서 전체 설치 (권장)
pnpm install

# 또는 이 앱만 설치
pnpm install
```

### 2. 개발 서버 실행
**Windows:**
```bash
start.bat
```

**Mac/Linux:**
```bash
./start.sh
```

또는 수동으로:
```bash
pnpm dev
```

### 3. 브라우저에서 접속
```
http://localhost:5174
```

## 사용 방법

### 노드 타입 설명

#### 1. 시작 노드 (녹색)
- 프로세스의 시작점
- 프로세스당 1개만 존재해야 함
- 다른 노드로 연결 가능

#### 2. 작업 노드 (파란색)
- 실제 업무 단계를 정의
- 체크리스트 항목 추가 가능
- 입력 필드 추가 가능 (텍스트/파일/날짜/숫자/텍스트영역)
- 여러 개 생성 가능

#### 3. 조건 노드 (노란색)
- 조건 분기를 위한 노드
- 참(true)/거짓(false) 두 가지 경로로 분기
- 현재는 단순 연결만 지원 (향후 조건 로직 추가 예정)

#### 4. 종료 노드 (빨간색)
- 프로세스의 종료점
- 최소 1개 이상 존재해야 함
- 여러 경로가 종료될 수 있음

### 프로세스 만들기 순서

1. **노드 추가**
   - 왼쪽 사이드바에서 노드 타입 버튼 클릭
   - 캔버스에 노드가 생성됨

2. **노드 연결**
   - 노드 하단(출력 핸들)에서 다른 노드 상단(입력 핸들)로 드래그
   - 화살표로 연결됨

3. **노드 편집**
   - 노드를 클릭하여 선택
   - 왼쪽 사이드바에서 제목, 설명, 체크리스트, 필드 편집

4. **추적 관리 설정**
   - 사이드바에서 부서, 담당자, 우선순위, 마감일 등 설정
   - 모든 필수 항목 입력 필요

5. **JSON 내보내기**
   - 상단 "JSON 내보내기" 버튼 클릭
   - 검증 통과 시 JSON 파일 다운로드
   - 검증 실패 시 오류 목록 표시

### 입력 필드 타입

- **text**: 짧은 텍스트 입력 (이름, 이메일 등)
- **number**: 숫자 입력 (금액, 수량 등)
- **date**: 날짜 선택
- **file**: 파일 업로드 (PDF, 이미지 등)
- **textarea**: 긴 텍스트 입력 (설명, 사유 등)

각 필드마다 라벨, 플레이스홀더, 필수 여부 설정 가능

## JSON 출력 형식

생성된 JSON 파일은 User Executor에서 바로 사용 가능합니다:

```json
{
  "id": "PROC-20260104-0001",
  "name": "프로세스 이름",
  "version": "1.0.0",
  "tracking": {
    "organizationId": "CORP-2026",
    "departmentId": "DEPT-HR",
    "departmentName": "인사팀",
    "processType": "ONBOARDING",
    "priority": "high",
    "assignedTo": "USER-12345",
    "assignedToName": "홍길동",
    "dueDate": "2026-01-11T17:00:00Z",
    "estimatedHours": 8
  },
  "steps": [
    {
      "id": "step-1",
      "title": "작업 제목",
      "description": "작업 설명",
      "checklist": [
        { "id": "check-1", "text": "체크 항목", "required": true }
      ],
      "fields": [
        {
          "id": "field-1",
          "type": "text",
          "label": "이름",
          "required": true,
          "placeholder": "홍길동"
        }
      ]
    }
  ]
}
```

## 샘플 프로세스

`samples/` 폴더에서 예제 파일을 확인하세요:

1. **simple-approval.json**: 간단한 2단계 승인 프로세스
2. **complex-project.json**: 복잡한 5단계 프로젝트 착수 프로세스

이 파일들은 User Executor에서 바로 실행 가능합니다.

## 검증 규칙

JSON 내보내기 전 다음 사항을 자동 검증합니다:

### 프로세스 구조
- ✅ 시작 노드가 정확히 1개 존재
- ✅ 종료 노드가 최소 1개 이상 존재
- ✅ 모든 노드가 연결됨 (고립된 노드 없음)
- ✅ 순환 참조 없음

### 추적 관리
- ✅ 조직 ID 존재
- ✅ 부서 ID 및 이름 존재
- ✅ 담당자 ID 및 이름 존재
- ✅ 우선순위 설정
- ✅ 마감일 설정

## 기술 스택

- **React 19**: UI 프레임워크
- **TypeScript**: 타입 안전성
- **Vite**: 빌드 도구
- **React Flow 11**: 드래그 앤 드롭 플로우 차트 (MIT 라이선스)
- **Zustand**: 상태 관리
- **Tailwind CSS**: 스타일링
- **Lucide React**: 아이콘

## 개발 명령어

```bash
# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 빌드 결과 미리보기
pnpm preview

# 코드 린팅
pnpm lint
```

## 프로젝트 구조

```
admin-builder/
├── src/
│   ├── components/
│   │   ├── ProcessBuilder.tsx       # React Flow 캔버스
│   │   ├── nodes/                   # 노드 컴포넌트
│   │   │   ├── StartNode.tsx
│   │   │   ├── TaskNode.tsx
│   │   │   ├── ConditionNode.tsx
│   │   │   └── EndNode.tsx
│   │   ├── sidebar/                 # 사이드바 컴포넌트
│   │   │   ├── NodePalette.tsx      # 노드 추가 팔레트
│   │   │   ├── NodeEditor.tsx       # 노드 편집 패널
│   │   │   └── TrackingSettings.tsx # 추적 관리 설정
│   │   └── export/
│   │       └── ExportButton.tsx     # JSON 내보내기 버튼
│   ├── stores/
│   │   └── process-store.ts         # Zustand 상태 관리
│   ├── services/
│   │   ├── export-service.ts        # JSON 생성 로직
│   │   └── tracking-service.ts      # ID 생성 유틸리티
│   ├── types/
│   │   ├── process.types.ts         # 프로세스 타입 정의
│   │   └── tracking.types.ts        # 추적 관리 타입 정의
│   ├── App.tsx                      # 메인 레이아웃
│   └── main.tsx                     # 앱 진입점
├── samples/                         # 샘플 프로세스 파일
├── start.bat                        # Windows 시작 스크립트
├── start.sh                         # Mac/Linux 시작 스크립트
└── package.json
```

## 향후 개발 계획

- [ ] 조건 노드 로직 정의 기능
- [ ] 프로세스 템플릿 저장/불러오기
- [ ] JSON 파일 가져오기 (역변환)
- [ ] 협업 모드 (실시간 공동 편집)
- [ ] 버전 관리 시스템
- [ ] 프로세스 시뮬레이션 기능

## 문제 해결

### Q: 노드가 연결되지 않아요
A: 노드의 하단(출력 핸들)에서 다른 노드의 상단(입력 핸들)로 드래그하세요. 시작 노드는 입력 핸들이 없고, 종료 노드는 출력 핸들이 없습니다.

### Q: JSON 내보내기 시 오류가 나요
A: 검증 오류 메시지를 확인하세요. 시작 노드 1개, 종료 노드 1개 이상, 모든 노드 연결, 추적 관리 필수 항목을 모두 채워야 합니다.

### Q: 조건 노드는 어떻게 사용하나요?
A: 현재는 단순 연결만 지원합니다. 조건 노드에서 두 개의 출력 핸들(참/거짓)이 있으며, 각각 다른 노드로 연결할 수 있습니다.

## 라이선스

MIT License

## 지원

문제가 발생하거나 기능 제안이 있으시면 이슈를 등록해주세요.
