# 타입 시스템 (Type System)

Task Process 모노레포 전체에서 사용되는 포괄적인 타입 시스템을 살펴봅니다.

## 개요

Task Process 시스템은 **TypeScript strict mode**와 **Zod**를 함께 사용하여 컴파일 타임과 런타임 모두에서 타입 안전성을 제공합니다.

## 핵심 타입 (Core Types)

### 프로세스 타입 (Process Types)

업무 프로세스를 위한 중심 데이터 구조:

```typescript
// packages/shared-types/src/process.ts
export interface Process {
  id: string;
  name: string;
  description?: string;
  steps: Step[];
  version: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Step {
  id: string;
  type: StepType;
  title: string;
  description?: string;
  validation?: ValidationRule[];
  dependencies?: string[];
}

export type StepType =
  | 'input'
  | 'select'
  | 'checkbox'
  | 'upload'
  | 'info';
```

### 실행 타입 (Execution Types)

프로세스 실행 및 추적을 위한 타입:

```typescript
// packages/shared-types/src/execution.ts
export interface ExecutionResult {
  processId: string;
  startTime: Date;
  endTime: Date;
  status: ExecutionStatus;
  steps: StepResult[];
}

export type ExecutionStatus =
  | 'pending'
  | 'running'
  | 'completed'
  | 'failed';

export interface StepResult {
  stepId: string;
  value: unknown;
  timestamp: Date;
  valid: boolean;
}
```

## Zod 스키마

Zod는 모든 데이터 구조에 대한 런타임 검증을 제공합니다.

### 프로세스 스키마

```typescript
import { z } from 'zod';

export const StepSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['input', 'select', 'checkbox', 'upload', 'info']),
  title: z.string().min(1),
  description: z.string().optional(),
  validation: z.array(ValidationRuleSchema).optional(),
  dependencies: z.array(z.string()).optional(),
});

export const ProcessSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  steps: z.array(StepSchema).min(1),
  version: z.string().regex(/^\d+\.\d+\.\d+$/),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Zod 스키마에서 TypeScript 타입 추론
export type Process = z.infer<typeof ProcessSchema>;
```

### 검증 (Validation)

Zod 스키마를 사용하여 데이터 검증:

```typescript
import { ProcessSchema } from '@task-process/shared-types';

function loadProcess(data: unknown): Process {
  // 검증 실패 시 예외 발생
  return ProcessSchema.parse(data);
}

// 안전한 파싱 (예외를 발생시키지 않음)
const result = ProcessSchema.safeParse(data);
if (result.success) {
  const process = result.data;
} else {
  console.error(result.error);
}
```

## 타입 가드 (Type Guards)

타입 가드는 런타임에 타입을 좁히는 데 도움을 줍니다:

```typescript
// packages/shared-types/src/guards.ts
export function isProcess(value: unknown): value is Process {
  return ProcessSchema.safeParse(value).success;
}

export function isExecutionResult(
  value: unknown
): value is ExecutionResult {
  return ExecutionResultSchema.safeParse(value).success;
}
```

사용 방법:

```typescript
function handleData(data: unknown) {
  if (isProcess(data)) {
    // TypeScript는 여기서 data가 Process 타입임을 알고 있음
    console.log(data.name);
  }
}
```

## 유틸리티 타입 (Utility Types)

### 부분 업데이트 (Partial Updates)

```typescript
export type ProcessUpdate = Partial<
  Omit<Process, 'id' | 'createdAt'>
>;

// 사용법
const update: ProcessUpdate = {
  name: 'New Name',
  // 다른 필드는 선택 사항
};
```

### Pick과 Omit

```typescript
// 표시에 필요한 필드만
export type ProcessSummary = Pick<
  Process,
  'id' | 'name' | 'version'
>;

// 민감한 필드 제외
export type PublicProcess = Omit<
  Process,
  'internalNotes'
>;
```

## 제네릭 타입 (Generic Types)

### Result 타입

```typescript
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// 사용법
function parseJSON(json: string): Result<unknown> {
  try {
    return { success: true, data: JSON.parse(json) };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
```

### 비동기 Result

```typescript
export type AsyncResult<T, E = Error> = Promise<Result<T, E>>;

async function loadProcess(
  id: string
): AsyncResult<Process> {
  try {
    const response = await fetch(`/api/processes/${id}`);
    const data = await response.json();
    const process = ProcessSchema.parse(data);
    return { success: true, data: process };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
```

## 타입 안전 이벤트 핸들러

### 이벤트 타입

```typescript
export interface ProcessEvents {
  created: Process;
  updated: ProcessUpdate;
  deleted: string;
  executed: ExecutionResult;
}

export type EventHandler<K extends keyof ProcessEvents> = (
  data: ProcessEvents[K]
) => void;
```

### 이벤트 에미터

```typescript
class TypedEventEmitter {
  private handlers = new Map<string, EventHandler<any>[]>();

  on<K extends keyof ProcessEvents>(
    event: K,
    handler: EventHandler<K>
  ): void {
    const handlers = this.handlers.get(event) || [];
    handlers.push(handler);
    this.handlers.set(event, handlers);
  }

  emit<K extends keyof ProcessEvents>(
    event: K,
    data: ProcessEvents[K]
  ): void {
    const handlers = this.handlers.get(event) || [];
    handlers.forEach((handler) => handler(data));
  }
}
```

## React 컴포넌트 타입

### Children이 있는 Props

```typescript
import type { ReactNode } from 'react';

interface CardProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export function Card({ title, children, className }: CardProps) {
  return (
    <div className={className}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}
```

### 제네릭 컴포넌트

```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  keyExtractor: (item: T) => string;
}

export function List<T>({
  items,
  renderItem,
  keyExtractor,
}: ListProps<T>) {
  return (
    <ul>
      {items.map((item) => (
        <li key={keyExtractor(item)}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}

// 사용법
<List
  items={processes}
  renderItem={(p) => <div>{p.name}</div>}
  keyExtractor={(p) => p.id}
/>
```

## 모범 사례 (Best Practices)

### 1. 타입 별칭에는 `type` 사용

```typescript
// ✅ 좋음
export type Status = 'active' | 'inactive';

// ❌ 피하기
export interface Status {
  value: 'active' | 'inactive';
}
```

### 2. 객체 형태에는 `interface` 사용

```typescript
// ✅ 좋음
export interface User {
  id: string;
  name: string;
}

// ❌ 피하기
export type User = {
  id: string;
  name: string;
};
```

### 3. 타입 전용 import에는 `import type` 사용

```typescript
// ✅ 좋음
import type { Process } from '@task-process/shared-types';

// ❌ 피하기 (타입만 사용하는 경우)
import { Process } from '@task-process/shared-types';
```

### 4. 외부 데이터 검증

외부 소스의 데이터는 항상 검증하세요:

```typescript
// ✅ 좋음
const process = ProcessSchema.parse(externalData);

// ❌ 피하기
const process = externalData as Process;
```

### 5. 구별된 유니온 사용 (Discriminated Unions)

```typescript
// ✅ 좋음
type Result =
  | { success: true; data: string }
  | { success: false; error: Error };

function handle(result: Result) {
  if (result.success) {
    // TypeScript는 result.data가 존재함을 알고 있음
    console.log(result.data);
  } else {
    // TypeScript는 result.error가 존재함을 알고 있음
    console.error(result.error);
  }
}
```

## TypeScript 설정

### strict 모드

모든 앱은 TypeScript strict 모드를 사용합니다:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "verbatimModuleSyntax": true
  }
}
```

### verbatimModuleSyntax

이 옵션은 명시적 `type` import를 요구합니다:

```typescript
// ✅ 필수
import type { Process } from './types';
import { processData } from './utils';

// ❌ 오류
import { Process, processData } from './types';
```

## 일반적인 패턴

### 옵셔널 체이닝 (Optional Chaining)

```typescript
const name = process?.steps?.[0]?.title ?? 'Untitled';
```

### Nullish 병합 (Nullish Coalescing)

```typescript
const description = process.description ?? 'No description';
```

### 타입 단언 (Type Assertion) - 신중하게 사용

```typescript
// 확실할 때만 사용
const element = document.getElementById('root') as HTMLElement;
```

### Non-null 단언 (피하기)

```typescript
// ❌ 피하기
const value = process.steps[0]!.value;

// ✅ 더 좋음
const step = process.steps[0];
if (step) {
  const value = step.value;
}
```

---

다음으로, Task Process 시스템에서 사용되는 AI 기반 테스트 전략을 알아봅니다.
