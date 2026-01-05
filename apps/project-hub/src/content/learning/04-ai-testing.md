# AI-Powered Testing

Learn about the comprehensive testing strategy used in the Task Process system, powered by AI-assisted tools.

## Testing Philosophy

The Task Process system uses a multi-layered testing approach:

1. **Unit Tests** - Test individual functions and components
2. **Integration Tests** - Test component interactions
3. **E2E Tests** - Test complete user workflows
4. **Type Tests** - Verify TypeScript types at compile time

## Testing Stack

### Vitest

Fast unit testing framework with native ESM support.

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

E2E testing with real browser automation.

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

Component testing with user-centric approach.

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

## AI-Assisted Testing

### Claude Code Integration

Use Claude Code to generate comprehensive tests:

```bash
# Generate tests for a component
claude "Write unit tests for src/components/ProcessList.tsx"

# Generate E2E test
claude "Create E2E test for the process creation workflow"

# Update tests after refactoring
claude "Update tests in __tests__ to match the new API"
```

### Test Generation Patterns

Claude Code follows these patterns when generating tests:

1. **Arrange-Act-Assert (AAA)**
   ```typescript
   it('should update process name', () => {
     // Arrange
     const process = createMockProcess();

     // Act
     const updated = updateProcessName(process, 'New Name');

     // Assert
     expect(updated.name).toBe('New Name');
   });
   ```

2. **Describe-Context-It**
   ```typescript
   describe('ProcessValidator', () => {
     describe('when process is valid', () => {
       it('returns success result', () => {
         // test code
       });
     });

     describe('when process is invalid', () => {
       it('returns error result', () => {
         // test code
       });
     });
   });
   ```

3. **Given-When-Then (BDD)**
   ```typescript
   test('process creation workflow', async () => {
     // Given: User is on the builder page
     await page.goto('/builder');

     // When: User creates a new process
     await createProcess('Test Process');

     // Then: Process appears in the list
     await expect(page.locator('[data-process-id]')).toBeVisible();
   });
   ```

## Test Organization

### File Structure

```
src/
├── components/
│   ├── Button.tsx
│   └── Button.test.tsx          # Co-located tests
├── utils/
│   ├── format.ts
│   └── format.test.ts
└── __tests__/                    # Integration tests
    └── workflow.test.tsx
```

### Test Naming

```typescript
// ✅ Good: Descriptive test names
it('should validate email format correctly');
it('displays error message when validation fails');
it('redirects to dashboard after successful login');

// ❌ Avoid: Vague test names
it('works');
it('test email');
it('validation');
```

## Mocking

### Function Mocks

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

### Module Mocks

```typescript
vi.mock('@task-process/shared-utils', () => ({
  formatDate: vi.fn(() => 'Mocked Date'),
  validateEmail: vi.fn(() => true),
}));
```

### Component Mocks

```typescript
vi.mock('../ProcessList', () => ({
  ProcessList: ({ processes }: any) => (
    <div data-testid="mock-process-list">
      {processes.length} processes
    </div>
  ),
}));
```

## Coverage

### Configuration

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

### Running Coverage

```bash
# Generate coverage report
pnpm test:coverage

# View HTML report
open coverage/index.html
```

### Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## E2E Testing

### Page Object Pattern

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

// Usage
test('create process with steps', async ({ page }) => {
  const builder = new BuilderPage(page);

  await builder.goto();
  await builder.createProcess('My Process');
  await builder.addStep('input', 'Enter Name');
  await builder.addStep('select', 'Choose Option');

  expect(await builder.getStepCount()).toBe(2);
});
```

### Visual Regression

```typescript
test('process builder layout', async ({ page }) => {
  await page.goto('http://localhost:5174');
  await expect(page).toHaveScreenshot('builder-page.png');
});
```

## Snapshot Testing

### Component Snapshots

```typescript
import { render } from '@testing-library/react';

it('matches snapshot', () => {
  const { container } = render(
    <ProcessCard process={mockProcess} />
  );
  expect(container.firstChild).toMatchSnapshot();
});
```

### Inline Snapshots

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

## Performance Testing

### Component Rendering

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

### Hook Performance

```typescript
it('memoizes expensive calculations', () => {
  const { result, rerender } = renderHook(
    ({ data }) => useProcessStats(data),
    { initialProps: { data: mockData } }
  );

  const firstResult = result.current;
  rerender({ data: mockData }); // Same data

  expect(result.current).toBe(firstResult); // Same reference
});
```

## Continuous Integration

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

## Best Practices

### 1. Test Behavior, Not Implementation

```typescript
// ✅ Good: Tests behavior
it('displays success message after save', async () => {
  render(<ProcessForm />);
  await userEvent.click(screen.getByText('Save'));
  expect(screen.getByText('Saved successfully')).toBeVisible();
});

// ❌ Avoid: Tests implementation
it('calls setState with correct value', () => {
  const { result } = renderHook(() => useProcessForm());
  result.current.handleSave();
  expect(setState).toHaveBeenCalledWith(/* ... */);
});
```

### 2. Keep Tests Independent

```typescript
// ✅ Good: Each test is independent
describe('ProcessList', () => {
  it('displays empty state', () => {
    render(<ProcessList processes={[]} />);
    // test code
  });

  it('displays processes', () => {
    render(<ProcessList processes={mockProcesses} />);
    // test code
  });
});

// ❌ Avoid: Tests depend on each other
let processes = [];
it('starts empty', () => { /* ... */ });
it('adds process', () => { processes.push(/* ... */); });
```

### 3. Use Data-Testid for E2E

```typescript
// Component
<button data-testid="save-button">Save</button>

// Test
await page.click('[data-testid="save-button"]');
```

### 4. Mock External Dependencies

```typescript
// ✅ Good: Mock external APIs
vi.mock('./api', () => ({
  fetchProcesses: vi.fn(() => Promise.resolve(mockProcesses)),
}));

// ❌ Avoid: Real API calls in tests
it('loads processes', async () => {
  const processes = await fetch('/api/processes'); // Real API call
});
```

### 5. Write Readable Assertions

```typescript
// ✅ Good: Clear assertion
expect(processes).toHaveLength(3);
expect(processes[0].name).toBe('Test Process');

// ❌ Avoid: Complex assertion
expect(processes.length === 3 && processes[0].name === 'Test Process').toBeTruthy();
```

---

Continue to the next section to see real-world examples from the Task Process system.
