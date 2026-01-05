# Type System

Explore the comprehensive type system used throughout the Task Process monorepo.

## Overview

The Task Process system uses **TypeScript strict mode** with **Zod** for runtime validation, providing both compile-time and runtime type safety.

## Core Types

### Process Types

The central data structure for business processes:

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

### Execution Types

Types for process execution and tracking:

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

## Zod Schemas

Zod provides runtime validation for all data structures.

### Process Schema

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

// Infer TypeScript type from Zod schema
export type Process = z.infer<typeof ProcessSchema>;
```

### Validation

Use Zod schemas to validate data:

```typescript
import { ProcessSchema } from '@task-process/shared-types';

function loadProcess(data: unknown): Process {
  // Throws if validation fails
  return ProcessSchema.parse(data);
}

// Safe parsing (doesn't throw)
const result = ProcessSchema.safeParse(data);
if (result.success) {
  const process = result.data;
} else {
  console.error(result.error);
}
```

## Type Guards

Type guards help narrow types at runtime:

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

Usage:

```typescript
function handleData(data: unknown) {
  if (isProcess(data)) {
    // TypeScript knows data is Process here
    console.log(data.name);
  }
}
```

## Utility Types

### Partial Updates

```typescript
export type ProcessUpdate = Partial<
  Omit<Process, 'id' | 'createdAt'>
>;

// Usage
const update: ProcessUpdate = {
  name: 'New Name',
  // Other fields optional
};
```

### Pick and Omit

```typescript
// Only the fields needed for display
export type ProcessSummary = Pick<
  Process,
  'id' | 'name' | 'version'
>;

// Exclude sensitive fields
export type PublicProcess = Omit<
  Process,
  'internalNotes'
>;
```

## Generic Types

### Result Type

```typescript
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// Usage
function parseJSON(json: string): Result<unknown> {
  try {
    return { success: true, data: JSON.parse(json) };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
```

### Async Result

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

## Type-Safe Event Handlers

### Event Types

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

### Event Emitter

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

## React Component Types

### Props with Children

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

### Generic Components

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

// Usage
<List
  items={processes}
  renderItem={(p) => <div>{p.name}</div>}
  keyExtractor={(p) => p.id}
/>
```

## Best Practices

### 1. Use `type` for Type Aliases

```typescript
// ✅ Good
export type Status = 'active' | 'inactive';

// ❌ Avoid
export interface Status {
  value: 'active' | 'inactive';
}
```

### 2. Use `interface` for Object Shapes

```typescript
// ✅ Good
export interface User {
  id: string;
  name: string;
}

// ❌ Avoid
export type User = {
  id: string;
  name: string;
};
```

### 3. Use `import type` for Type-Only Imports

```typescript
// ✅ Good
import type { Process } from '@task-process/shared-types';

// ❌ Avoid (when only using type)
import { Process } from '@task-process/shared-types';
```

### 4. Validate External Data

Always validate data from external sources:

```typescript
// ✅ Good
const process = ProcessSchema.parse(externalData);

// ❌ Avoid
const process = externalData as Process;
```

### 5. Use Discriminated Unions

```typescript
// ✅ Good
type Result =
  | { success: true; data: string }
  | { success: false; error: Error };

function handle(result: Result) {
  if (result.success) {
    // TypeScript knows result.data exists
    console.log(result.data);
  } else {
    // TypeScript knows result.error exists
    console.error(result.error);
  }
}
```

## TypeScript Configuration

### strict Mode

All apps use TypeScript strict mode:

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

This requires explicit `type` imports:

```typescript
// ✅ Required
import type { Process } from './types';
import { processData } from './utils';

// ❌ Error
import { Process, processData } from './types';
```

## Common Patterns

### Optional Chaining

```typescript
const name = process?.steps?.[0]?.title ?? 'Untitled';
```

### Nullish Coalescing

```typescript
const description = process.description ?? 'No description';
```

### Type Assertion (Use Sparingly)

```typescript
// Only when you're certain
const element = document.getElementById('root') as HTMLElement;
```

### Non-null Assertion (Avoid)

```typescript
// ❌ Avoid
const value = process.steps[0]!.value;

// ✅ Better
const step = process.steps[0];
if (step) {
  const value = step.value;
}
```

---

Next, learn about AI-powered testing strategies used in the Task Process system.
