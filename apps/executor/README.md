# User Executor - 업무 프로세스 실행기

관리자가 만든 JSON 프로세스 파일을 로드하여, 사용자가 단계별로 업무를 진행하고, 완료 후 ZIP으로 내보내는 웹 애플리케이션입니다.

## 주요 기능

### 1. 프로세스 실행
- JSON 프로세스 파일 로드 (드래그앤드롭)
- 단계별 진행 (체크리스트 + 폼 필드)
- 실시간 진행률 표시
- 자동 저장 (500ms debounce)

### 2. 파일 관리
- 파일 업로드 (IndexedDB Blob 저장)
- 파일 크기 제한 검증
- 파일 형식 검증
- ZIP 내보내기 (프로세스 + 첨부파일)

### 3. 추적 관리
- 진행 상황 로깅
- 마감일 알림
- 소요 시간 추적
- 변경 이력 기록

### 4. AI 챗봇 통합
- LibreChat iframe 슬라이드 패널
- 프로세스 컨텍스트 자동 전달
- ESC 키로 닫기

## 빠른 시작

### Windows
```bash
start.bat
```

### Mac/Linux
```bash
chmod +x start.sh
./start.sh
```

브라우저가 자동으로 열립니다: http://localhost:8000

## 사용 방법

### 1. 프로세스 로드
1. "프로세스 로드" 버튼 클릭 또는 드래그앤드롭
2. JSON 파일 선택 (예: `samples/processes/onboarding.json`)
3. 자동으로 프로세스 실행 화면으로 전환

### 2. 단계 진행
1. **체크리스트**: 필수 항목 체크
2. **폼 필드**: 텍스트, 숫자, 날짜, 파일 입력
3. **다음 버튼**: 검증 후 다음 단계로 이동
4. **이전 버튼**: 이전 단계로 되돌아가기

### 3. 완료 및 내보내기
1. 모든 단계 완료 시 "완료" 화면 표시
2. "ZIP 내보내기" 버튼 클릭
3. 프로세스 데이터 + 첨부 파일 다운로드

## 샘플 프로세스

### 1. 신입사원 온보딩 (`onboarding.json`)
- **단계**: 개인정보 입력 → 서류 제출 → 계정 설정 → 완료
- **예상 시간**: 8시간
- **우선순위**: 높음

### 2. 경비 지출 보고서 (`expense-report.json`)
- **단계**: 지출 정보 입력 → 증빙 자료 제출 → 승인 요청 → 완료
- **예상 시간**: 2시간
- **우선순위**: 보통

### 3. 휴가 신청 (`leave-request.json`)
- **단계**: 휴가 정보 입력 → 인수인계 → 승인 요청 → 완료
- **예상 시간**: 1시간
- **우선순위**: 낮음

## JSON 구조

### 프로세스 파일 예시
```json
{
  "id": "PROC-20260104-0001",
  "name": "신입사원 온보딩",
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
      "title": "개인정보 입력",
      "description": "기본 개인 정보를 입력하세요",
      "checklist": [
        {
          "id": "check-1",
          "text": "이름 확인",
          "required": true
        }
      ],
      "fields": [
        {
          "id": "field-1",
          "type": "text",
          "label": "이름",
          "required": true
        },
        {
          "id": "field-2",
          "type": "file",
          "label": "이력서",
          "required": true,
          "validation": {
            "accept": ".pdf,.docx",
            "maxSize": 10485760
          }
        }
      ]
    }
  ]
}
```

### 필드 타입
- `text`: 텍스트 입력
- `number`: 숫자 입력
- `date`: 날짜 선택
- `textarea`: 장문 텍스트 입력
- `file`: 파일 업로드

### 파일 검증
```json
{
  "type": "file",
  "validation": {
    "accept": ".pdf,.docx,.jpg,.png",
    "maxSize": 10485760  // 10MB (bytes)
  }
}
```

## IndexedDB 스토어

### 1. processes
프로세스 템플릿 저장
- **키**: `id` (프로세스 ID)
- **인덱스**: `name`, `createdAt`

### 2. progresses
진행 상황 저장
- **키**: `processId`
- **인덱스**: `status`, `updatedAt`

### 3. files
첨부 파일 저장 (Blob)
- **키**: `id` (자동 증가)
- **인덱스**: `processId`, `fieldId`

### 4. logs
변경 이력 저장
- **키**: `id` (자동 증가)
- **인덱스**: `processId`, `timestamp`

### 5. notifications
알림 저장
- **키**: `id` (자동 증가)
- **인덱스**: `processId`, `createdAt`, `read`

## 기술 스택

### 프론트엔드
- **HTML5**: 시맨틱 마크업
- **CSS3**: 그리드, 플렉스박스, 애니메이션
- **JavaScript (ES6+)**: 모듈, 클래스, async/await

### 라이브러리
- **JSZip**: ZIP 파일 생성 (v3.10.1)
- **IndexedDB**: 클라이언트 저장소

### 아키텍처
- **클래스 기반**: IndexedDBManager, ProcessExecutor, TrackingLogger, FileHandler, UIManager, ChatbotManager
- **이벤트 드리븐**: 사용자 인터랙션 처리
- **반응형 디자인**: 모바일/데스크톱 대응

## 보안 고려사항

### 1. 파일 업로드
- 크기 제한 (최대 10MB 권장)
- 형식 검증 (accept 속성)
- IndexedDB Blob 저장 (Base64 금지)

### 2. 데이터 저장
- 클라이언트 저장소만 사용 (서버 전송 없음)
- QuotaExceeded 에러 핸들링
- 민감 정보는 ZIP 내보내기 후 수동 전송

### 3. 입력 검증
- 필수 필드 검증
- 체크리스트 검증
- 파일 크기/형식 검증

## 문제 해결

### 프로세스가 로드되지 않음
- JSON 파일 형식 확인 (필수 필드: id, name, version, steps)
- 브라우저 콘솔에서 오류 메시지 확인

### 파일 업로드 실패
- 파일 크기 확인 (10MB 이하 권장)
- 파일 형식 확인 (validation.accept)
- IndexedDB 저장 공간 확인

### ZIP 내보내기 실패
- JSZip 라이브러리 로드 확인
- 브라우저 다운로드 권한 확인

## 브라우저 호환성

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## 라이선스

MIT License

## 문의

프로젝트 이슈: [GitHub Issues](https://github.com/your-repo/issues)
