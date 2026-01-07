# AI 기반 테스트 (AI-Powered Testing)

Task Process 시스템에서 사용되는 포괄적인 테스트 전략을 AI 보조 도구와 함께 알아봅니다.

## 테스트 철학

Task Process 시스템은 다층적 테스트 접근 방식을 사용합니다:

1. **단위 테스트 (Unit Tests)** - 개별 함수와 컴포넌트 테스트
2. **통합 테스트 (Integration Tests)** - 컴포넌트 간 상호작용 테스트
3. **E2E 테스트 (E2E Tests)** - 완전한 사용자 워크플로우 테스트
4. **타입 테스트 (Type Tests)** - 컴파일 타임에 TypeScript 타입 검증

## 테스트 스택

### Vitest

네이티브 ESM 지원을 갖춘 빠른 단위 테스트 프레임워크.

```typescript
// packages/shared-utils/src/format.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate } from './format';

describe('formatDate', () => {
  it('formats dates correctly', () => {
    const date = new Date('2024-01-15');
    expect(formatDate(date)).toBe('1/15/2024');
  });

  it('handles invalid dates', () => {
    expect(() => formatDate(null as any)).toThrow();
  });
});
```

### Playwright

실제 브라우저 자동화를 통한 E2E 테스트.

```typescript
// tests/e2e/builder.spec.ts
import { test, expect } from '@playwright/test';

test('create new process', async ({ page }) => {
  await page.goto('http://localhost:5174');

  await page.click('[data-testid="new-process"]');
  await page.fill('[name="processName"]', 'Test Process');
  await page.click('[data-testid="save-process"]');

  await expect(page.locator('.toast-success')).toBeVisible();
});
```

### React Testing Library

사용자 중심 접근 방식의 컴포넌트 테스트.

```typescript
// packages/shared-ui/src/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies variant classes', () => {
    const { container } = render(
      <Button variant="primary">Click me</Button>
    );
    expect(container.firstChild).toHaveClass('bg-blue-500');
  });
});
```

## AI 보조 테스트

### Claude Code 통합

Claude Code를 사용하여 포괄적인 테스트 생성:

```bash
# 컴포넌트에 대한 테스트 생성
claude "Write unit tests for src/components/ProcessList.tsx"

# E2E 테스트 생성
claude "Create E2E test for the process creation workflow"

# 리팩토링 후 테스트 업데이트
claude "Update tests in __tests__ to match the new API"
```

### 테스트 생성 패턴

Claude Code는 테스트를 생성할 때 다음 패턴을 따릅니다:

1. **AAA 패턴 (Arrange-Act-Assert)**
   ```typescript
   it('should update process name', () => {
     // Arrange (준비)
     const process = createMockProcess();

     // Act (실행)
     const updated = updateProcessName(process, 'New Name');

     // Assert (검증)
     expect(updated.name).toBe('New Name');
   });
   ```

2. **Describe-Context-It**
   ```typescript
   describe('ProcessValidator', () => {
     describe('when process is valid', () => {
       it('returns success result', () => {
         // 테스트 코드
       });
     });

     describe('when process is invalid', () => {
       it('returns error result', () => {
         // 테스트 코드
       });
     });
   });
   ```

3. **Given-When-Then (BDD)**
   ```typescript
   test('process creation workflow', async () => {
     // Given: 사용자가 빌더 페이지에 있음
     await page.goto('/builder');

     // When: 사용자가 새 프로세스를 생성
     await createProcess('Test Process');

     // Then: 프로세스가 목록에 나타남
     await expect(page.locator('[data-process-id]')).toBeVisible();
   });
   ```

## 테스트 구성

### 파일 구조

```
src/
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx          # 함께 위치한 테스트
├── utils/
│   ├── format.ts
│   └── format.test.ts
└── __tests__/                    # 통합 테스트
    └── workflow.test.tsx
```

### 테스트 명명 규칙

```typescript
// ✅ 좋음: 설명적인 테스트 이름
it('should validate email format correctly');
it('displays error message when validation fails');
it('redirects to dashboard after successful login');

// ❌ 피하기: 모호한 테스트 이름
it('works');
it('test email');
it('validation');
```

## 모킹 (Mocking)

### 함수 모킹

```typescript
import { vi } from 'vitest';

const mockFetch = vi.fn();
global.fetch = mockFetch;

it('fetches process data', async () => {
  mockFetch.mockResolvedValue({
    json: () => Promise.resolve({ id: '123', name: 'Test' }),
  });

  const process = await loadProcess('123');
  expect(process.name).toBe('Test');
  expect(mockFetch).toHaveBeenCalledWith('/api/processes/123');
});
```

### 모듈 모킹

```typescript
vi.mock('@task-process/shared-utils', () => ({
  formatDate: vi.fn(() => 'Mocked Date'),
  validateEmail: vi.fn(() => true),
}));
```

### 컴포넌트 모킹

```typescript
vi.mock('../ProcessList', () => ({
  ProcessList: ({ processes }: any) => (
    <div data-testid="mock-process-list">
      {processes.length} processes
    </div>
  ),
}));
```

## 커버리지 (Coverage)

### 설정

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        '**/*.spec.ts',
      ],
    },
  },
});
```

### 커버리지 실행

```bash
# 커버리지 리포트 생성
pnpm test:coverage

# HTML 리포트 보기
open coverage/index.html
```

### 커버리지 목표

- **Statements (구문)**: > 80%
- **Branches (분기)**: > 75%
- **Functions (함수)**: > 80%
- **Lines (라인)**: > 80%

## E2E 테스트

### Page Object 패턴

```typescript
// tests/pages/BuilderPage.ts
export class BuilderPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('http://localhost:5174');
  }

  async createProcess(name: string) {
    await this.page.click('[data-testid="new-process"]');
    await this.page.fill('[name="processName"]', name);
    await this.page.click('[data-testid="save-process"]');
  }

  async addStep(type: string, title: string) {
    await this.page.click(`[data-step-type="${type}"]`);
    await this.page.fill('[name="stepTitle"]', title);
    await this.page.click('[data-testid="add-step"]');
  }

  async getStepCount() {
    return this.page.locator('[data-testid="step"]').count();
  }
}

// 사용법
test('create process with steps', async ({ page }) => {
  const builder = new BuilderPage(page);

  await builder.goto();
  await builder.createProcess('My Process');
  await builder.addStep('input', 'Enter Name');
  await builder.addStep('select', 'Choose Option');

  expect(await builder.getStepCount()).toBe(2);
});
```

### 비주얼 리그레션 (Visual Regression)

```typescript
test('process builder layout', async ({ page }) => {
  await page.goto('http://localhost:5174');
  await expect(page).toHaveScreenshot('builder-page.png');
});
```

## 스냅샷 테스트 (Snapshot Testing)

### 컴포넌트 스냅샷

```typescript
import { render } from '@testing-library/react';

it('matches snapshot', () => {
  const { container } = render(
    <ProcessCard process={mockProcess} />
  );
  expect(container.firstChild).toMatchSnapshot();
});
```

### 인라인 스냅샷

```typescript
it('generates correct JSON', () => {
  const json = serializeProcess(mockProcess);
  expect(json).toMatchInlineSnapshot(`
    {
      "id": "123",
      "name": "Test Process",
      "steps": []
    }
  `);
});
```

## 성능 테스트 (Performance Testing)

### 컴포넌트 렌더링

```typescript
import { renderHook } from '@testing-library/react';
import { performance } from 'perf_hooks';

it('renders large list efficiently', () => {
  const start = performance.now();

  render(<ProcessList processes={largeMockArray} />);

  const end = performance.now();
  expect(end - start).toBeLessThan(100); // < 100ms
});
```

### Hook 성능

```typescript
it('memoizes expensive calculations', () => {
  const { result, rerender } = renderHook(
    ({ data }) => useProcessStats(data),
    { initialProps: { data: mockData } }
  );

  const firstResult = result.current;
  rerender({ data: mockData }); // 같은 데이터

  expect(result.current).toBe(firstResult); // 같은 참조
});
```

## 지속적 통합 (Continuous Integration)

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2

      - name: Install dependencies
        run: pnpm install

      - name: Run unit tests
        run: pnpm test:unit

      - name: Run E2E tests
        run: pnpm test:e2e

      - name: Generate coverage
        run: pnpm test:coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## 모범 사례

### 1. 구현이 아닌 동작을 테스트

```typescript
// ✅ 좋음: 동작을 테스트
it('displays success message after save', async () => {
  render(<ProcessForm />);
  await userEvent.click(screen.getByText('Save'));
  expect(screen.getByText('Saved successfully')).toBeVisible();
});

// ❌ 피하기: 구현을 테스트
it('calls setState with correct value', () => {
  const { result } = renderHook(() => useProcessForm());
  result.current.handleSave();
  expect(setState).toHaveBeenCalledWith(/* ... */);
});
```

### 2. 테스트를 독립적으로 유지

```typescript
// ✅ 좋음: 각 테스트가 독립적
describe('ProcessList', () => {
  it('displays empty state', () => {
    render(<ProcessList processes={[]} />);
    // 테스트 코드
  });

  it('displays processes', () => {
    render(<ProcessList processes={mockProcesses} />);
    // 테스트 코드
  });
});

// ❌ 피하기: 테스트가 서로 의존
let processes = [];
it('starts empty', () => { /* ... */ });
it('adds process', () => { processes.push(/* ... */); });
```

### 3. E2E에는 data-testid 사용

```typescript
// 컴포넌트
<button data-testid="save-button">Save</button>

// 테스트
await page.click('[data-testid="save-button"]');
```

### 4. 외부 의존성 모킹

```typescript
// ✅ 좋음: 외부 API 모킹
vi.mock('./api', () => ({
  fetchProcesses: vi.fn(() => Promise.resolve(mockProcesses)),
}));

// ❌ 피하기: 테스트에서 실제 API 호출
it('loads processes', async () => {
  const processes = await fetch('/api/processes'); // 실제 API 호출
});
```

### 5. 읽기 쉬운 단언문 작성

```typescript
// ✅ 좋음: 명확한 단언문
expect(processes).toHaveLength(3);
expect(processes[0].name).toBe('Test Process');

// ❌ 피하기: 복잡한 단언문
expect(processes.length === 3 && processes[0].name === 'Test Process').toBeTruthy();
```

---

다음 섹션에서 Task Process 시스템의 실제 예제를 살펴봅니다.
