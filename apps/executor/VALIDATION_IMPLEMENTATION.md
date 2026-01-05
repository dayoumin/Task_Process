# 인라인 Form Validation 구현

## 개요
Executor 앱에 실시간 인라인 form validation을 구현했습니다. 기존의 alert 팝업 방식에서 사용자 친화적인 인라인 에러 표시 방식으로 개선했습니다.

## 구현 내용

### 1. CSS 스타일 추가 ([main.css](css/main.css))

에러 상태를 시각적으로 표시하기 위한 스타일 추가:
- `.form-group.error` - 에러 상태의 입력 필드 스타일
- `.error-text` - 에러 메시지 텍스트 스타일
- `.checklist-item.error` - 에러 상태의 체크리스트 항목 스타일
- `.file-input-label.error` - 에러 상태의 파일 업로드 스타일

### 2. 검증 로직 개선 ([process-executor.js](js/process-executor.js))

**기존 방식:**
```javascript
validateStep(step) {
    if (field.required && !value) {
        alert(`필수 입력 필드를 작성하세요: ${field.label}`);
        return false;
    }
    return true;
}
```

**개선된 방식:**
```javascript
validateStep(step) {
    const errors = {};

    // 필수 필드 검증
    if (field.required && !value) {
        errors[`field-${field.id}`] = `이 필드는 필수입니다`;
    }

    // 추가 검증 규칙
    if (value && field.validation) {
        // minLength, maxLength
        if (field.validation.minLength && value.length < field.validation.minLength) {
            errors[`field-${field.id}`] = `최소 ${field.validation.minLength}자 이상 입력하세요`;
        }

        // min, max (숫자)
        if (field.validation.min !== undefined && Number(value) < field.validation.min) {
            errors[`field-${field.id}`] = `${field.validation.min} 이상의 값을 입력하세요`;
        }

        // pattern (정규식)
        if (field.validation.pattern) {
            const regex = new RegExp(field.validation.pattern);
            if (!regex.test(value)) {
                errors[`field-${field.id}`] = field.validation.message || '올바른 형식이 아닙니다';
            }
        }
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}
```

### 3. UI 렌더링 개선 ([ui.js](js/ui.js))

**에러 표시 기능:**
- `renderStep()` - validation errors 파라미터 추가
- `renderField()` - 각 필드에 에러 상태 및 에러 메시지 표시
- `renderChecklist()` - 체크리스트 항목에 에러 표시
- `clearValidationError()` - 실시간으로 에러 제거

**실시간 검증:**
사용자가 입력하거나 체크박스를 변경할 때 자동으로 에러 제거:
```javascript
input.addEventListener('input', async (e) => {
    const fieldId = e.target.dataset.fieldId;
    await this.executor.updateField(step.id, fieldId, fieldLabel, e.target.value);
    this.clearValidationError(`field-${fieldId}`);  // 에러 자동 제거
});
```

### 4. 앱 로직 개선 ([app.js](js/app.js))

**Next 버튼 클릭 시:**
```javascript
async nextStep() {
    const result = await this.processExecutor.nextStep();

    if (result.success) {
        await this.renderCurrentState();
        this.chatbot.updateContext(...);
    } else if (result.errors) {
        // 에러와 함께 현재 상태 재렌더링
        await this.renderCurrentState(result.errors);

        // 첫 번째 에러로 스크롤
        const firstError = document.querySelector('.form-group.error, .checklist-item.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}
```

## 지원하는 검증 규칙

### 필수 필드 (required)
```json
{
  "id": "field-1",
  "type": "text",
  "label": "이름",
  "required": true
}
```

### 최소/최대 길이 (minLength, maxLength)
```json
{
  "id": "field-2",
  "type": "text",
  "label": "사유",
  "required": true,
  "validation": {
    "minLength": 10,
    "maxLength": 100
  }
}
```

### 숫자 범위 (min, max)
```json
{
  "id": "field-3",
  "type": "number",
  "label": "나이",
  "required": true,
  "validation": {
    "min": 1,
    "max": 120
  }
}
```

### 정규식 패턴 (pattern)
```json
{
  "id": "field-4",
  "type": "text",
  "label": "휴대폰 번호",
  "required": true,
  "validation": {
    "pattern": "^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$",
    "message": "올바른 휴대폰 번호 형식을 입력하세요 (예: 010-1234-5678)"
  }
}
```

## 테스트 방법

### 1. 개발 서버 실행
```bash
cd apps/executor
pnpm dev
```

### 2. 테스트 프로세스 파일 로드
- [samples/processes/validation-test.json](samples/processes/validation-test.json) 파일 사용
- 5개 단계로 구성된 종합 검증 테스트

### 3. 검증 시나리오

**Step 1: 필수 필드 검증**
1. 아무것도 입력하지 않고 "다음" 버튼 클릭
2. ✅ 모든 필수 필드에 빨간색 테두리와 에러 메시지 표시
3. 필드 입력 시작
4. ✅ 해당 필드의 에러 메시지 자동 제거

**Step 2: 입력 길이 검증**
1. 최소 길이보다 짧게 입력 후 "다음" 클릭
2. ✅ "최소 N자 이상 입력하세요" 메시지 표시
3. 최대 길이를 초과하여 입력 후 "다음" 클릭
4. ✅ "최대 N자까지 입력 가능합니다" 메시지 표시

**Step 3: 숫자 범위 검증**
1. 최소값보다 작은 숫자 입력
2. ✅ "N 이상의 값을 입력하세요" 메시지 표시
3. 최대값보다 큰 숫자 입력
4. ✅ "N 이하의 값을 입력하세요" 메시지 표시

**Step 4: 패턴 검증**
1. 잘못된 형식의 휴대폰 번호 입력 (예: "123")
2. ✅ "올바른 휴대폰 번호 형식을 입력하세요" 메시지 표시
3. 잘못된 형식의 이메일 입력 (예: "test@invalid")
4. ✅ "올바른 이메일 형식을 입력하세요" 메시지 표시

## UX 개선 사항

### 이전 (alert 방식)
- ❌ 팝업이 화면을 가림
- ❌ 한 번에 하나의 에러만 표시
- ❌ 어떤 필드에 문제가 있는지 찾기 어려움
- ❌ 에러를 확인한 후 다시 필드를 찾아야 함

### 개선 (인라인 방식)
- ✅ 모든 에러를 동시에 표시
- ✅ 각 필드 바로 아래 에러 메시지 표시
- ✅ 빨간색 테두리로 에러 필드 강조
- ✅ 입력 시작 시 에러 자동 제거
- ✅ 첫 번째 에러로 자동 스크롤
- ✅ 직관적이고 사용자 친화적

## 파일 수정 내역

1. **apps/executor/css/main.css**
   - 에러 상태 스타일 추가 (30줄)

2. **apps/executor/js/process-executor.js**
   - `validateStep()` 메서드 개선 (56줄 → 67줄)
   - `nextStep()` 반환값 변경 (`boolean` → `{success, errors}`)

3. **apps/executor/js/ui.js**
   - `renderStep()` - validation errors 파라미터 추가
   - `renderChecklist()` - 에러 표시 기능 추가
   - `renderFields()` - 에러 표시 기능 추가
   - `renderField()` - 각 필드 타입별 에러 표시
   - `clearValidationError()` - 새로운 메서드 추가 (26줄)
   - `attachEventListeners()` - 실시간 에러 제거 로직 추가

4. **apps/executor/js/app.js**
   - `renderCurrentState()` - validation errors 파라미터 추가
   - `nextStep()` - 에러 처리 및 스크롤 로직 추가

5. **apps/executor/samples/processes/leave-request.json**
   - 기존 샘플 파일에 validation 규칙 추가

6. **apps/executor/samples/processes/validation-test.json**
   - 새로운 종합 검증 테스트 파일 생성

## 다음 단계

- [ ] E2E 테스트 작성 (Playwright)
- [ ] 파일 업로드 검증 (파일 크기, 확장자)
- [ ] 커스텀 검증 함수 지원
- [ ] 검증 에러 다국어 지원
