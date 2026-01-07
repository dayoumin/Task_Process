# 실제 예제 (Real Examples)

Task Process 시스템의 실제 코드 예제를 살펴봅니다.

## 프로세스 빌더 컴포넌트

### Zustand를 사용한 Store

```typescript
// apps/builder/src/store/processStore.ts
import { create } from 'zustand';
import type { Process, Step } from '@task-process/shared-types';

interface ProcessState {
  currentProcess: Process | null;
  steps: Step[];
  isDirty: boolean;

  // 액션
  setProcess: (process: Process) => void;
  addStep: (step: Step) => void;
  updateStep: (id: string, updates: Partial<Step>) => void;
  deleteStep: (id: string) => void;
  reorderSteps: (startIndex: number, endIndex: number) => void;
  saveProcess: () => Promise<void>;
}

export const useProcessStore = create<ProcessState>((set, get) => ({
  currentProcess: null,
  steps: [],
  isDirty: false,

  setProcess: (process) =>
    set({ currentProcess: process, steps: process.steps, isDirty: false }),

  addStep: (step) =>
    set((state) => ({
      steps: [...state.steps, step],
      isDirty: true,
    })),

  updateStep: (id, updates) =>
    set((state) => ({
      steps: state.steps.map((step) =>
        step.id === id ? { ...step, ...updates } : step
      ),
      isDirty: true,
    })),

  deleteStep: (id) =>
    set((state) => ({
      steps: state.steps.filter((step) => step.id !== id),
      isDirty: true,
    })),

  reorderSteps: (startIndex, endIndex) =>
    set((state) => {
      const steps = Array.from(state.steps);
      const [removed] = steps.splice(startIndex, 1);
      steps.splice(endIndex, 0, removed);
      return { steps, isDirty: true };
    }),

  saveProcess: async () => {
    const { currentProcess, steps } = get();
    if (!currentProcess) return;

    const updated = {
      ...currentProcess,
      steps,
      updatedAt: new Date(),
    };

    // 백엔드에 저장
    await fetch(`/api/processes/${updated.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });

    set({ currentProcess: updated, isDirty: false });
  },
}));
```

### 비주얼 플로우 에디터

```typescript
// apps/builder/src/components/FlowEditor.tsx
import { useCallback } from 'react';
import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useProcessStore } from '../store/processStore';

export function FlowEditor() {
  const { steps, updateStep } = useProcessStore();

  const [nodes, setNodes, onNodesChange] = useNodesState(
    steps.map((step, index) => ({
      id: step.id,
      type: 'custom',
      position: { x: 100, y: index * 150 },
      data: { step },
    }))
  );

  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: any) => {
      // 수정 다이얼로그 열기
      console.log('Edit step:', node.data.step);
    },
    []
  );

  return (
    <div className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </div>
  );
}
```

## 프로세스 실행기

### 스텝 실행 엔진

```typescript
// apps/executor/src/engine/executor.ts
import type {
  Process,
  Step,
  ExecutionResult,
  StepResult,
} from '@task-process/shared-types';

export class ProcessExecutor {
  private currentStepIndex = 0;
  private results: StepResult[] = [];

  constructor(private process: Process) {}

  async execute(): Promise<ExecutionResult> {
    const startTime = new Date();

    try {
      for (const step of this.process.steps) {
        const result = await this.executeStep(step);
        this.results.push(result);

        if (!result.valid) {
          return this.createResult('failed', startTime);
        }
      }

      return this.createResult('completed', startTime);
    } catch (error) {
      console.error('Execution failed:', error);
      return this.createResult('failed', startTime);
    }
  }

  private async executeStep(step: Step): Promise<StepResult> {
    // 의존성 확인
    if (step.dependencies) {
      const dependenciesMet = this.checkDependencies(
        step.dependencies
      );
      if (!dependenciesMet) {
        throw new Error(
          `Dependencies not met for step ${step.id}`
        );
      }
    }

    // 스텝 타입에 따라 사용자 입력 받기
    const value = await this.getUserInput(step);

    // 입력 검증
    const valid = this.validateInput(step, value);

    return {
      stepId: step.id,
      value,
      timestamp: new Date(),
      valid,
    };
  }

  private checkDependencies(
    dependencyIds: string[]
  ): boolean {
    return dependencyIds.every((id) =>
      this.results.some((r) => r.stepId === id && r.valid)
    );
  }

  private async getUserInput(step: Step): Promise<unknown> {
    // 스텝 타입에 따라 구현이 달라짐
    switch (step.type) {
      case 'input':
        return this.getTextInput(step);
      case 'select':
        return this.getSelectInput(step);
      case 'checkbox':
        return this.getCheckboxInput(step);
      case 'upload':
        return this.getFileUpload(step);
      default:
        return null;
    }
  }

  private validateInput(step: Step, value: unknown): boolean {
    if (!step.validation) return true;

    return step.validation.every((rule) => {
      switch (rule.type) {
        case 'required':
          return value != null && value !== '';
        case 'minLength':
          return (
            typeof value === 'string' &&
            value.length >= rule.value
          );
        case 'maxLength':
          return (
            typeof value === 'string' &&
            value.length <= rule.value
          );
        case 'pattern':
          return (
            typeof value === 'string' &&
            new RegExp(rule.value).test(value)
          );
        default:
          return true;
      }
    });
  }

  private createResult(
    status: 'completed' | 'failed',
    startTime: Date
  ): ExecutionResult {
    return {
      processId: this.process.id,
      startTime,
      endTime: new Date(),
      status,
      steps: this.results,
    };
  }
}
```

### 실행을 위한 React Hook

```typescript
// apps/executor/src/hooks/useProcessExecution.ts
import { useState, useCallback } from 'react';
import type { Process, ExecutionResult } from '@task-process/shared-types';
import { ProcessExecutor } from '../engine/executor';

export function useProcessExecution(process: Process | null) {
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async () => {
    if (!process) return;

    setIsExecuting(true);
    setError(null);

    try {
      const executor = new ProcessExecutor(process);
      const result = await executor.execute();
      setResult(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsExecuting(false);
    }
  }, [process]);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return {
    result,
    isExecuting,
    error,
    execute,
    reset,
  };
}

// 컴포넌트에서 사용
function ExecutorPage() {
  const { result, isExecuting, error, execute } =
    useProcessExecution(currentProcess);

  return (
    <div>
      <button onClick={execute} disabled={isExecuting}>
        {isExecuting ? 'Running...' : 'Start Process'}
      </button>

      {error && <div className="error">{error.message}</div>}

      {result && (
        <div className="result">
          <h3>Execution Complete</h3>
          <p>Status: {result.status}</p>
          <p>Steps: {result.steps.length}</p>
        </div>
      )}
    </div>
  );
}
```

## 대시보드 분석

### 통계 계산기

```typescript
// apps/dashboard/src/services/statistics.ts
import type { ExecutionResult } from '@task-process/shared-types';

export interface Statistics {
  totalExecutions: number;
  successRate: number;
  averageDuration: number;
  stepCompletionRates: Map<string, number>;
}

export function calculateStatistics(
  results: ExecutionResult[]
): Statistics {
  if (results.length === 0) {
    return {
      totalExecutions: 0,
      successRate: 0,
      averageDuration: 0,
      stepCompletionRates: new Map(),
    };
  }

  const totalExecutions = results.length;
  const successfulExecutions = results.filter(
    (r) => r.status === 'completed'
  ).length;
  const successRate = (successfulExecutions / totalExecutions) * 100;

  const durations = results.map(
    (r) => r.endTime.getTime() - r.startTime.getTime()
  );
  const averageDuration =
    durations.length > 0
      ? durations.reduce((a, b) => a + b, 0) / durations.length
      : 0;

  const stepCompletionRates = new Map<string, number>();
  const stepCounts = new Map<string, { total: number; valid: number }>();

  results.forEach((result) => {
    result.steps.forEach((step) => {
      const current = stepCounts.get(step.stepId) || {
        total: 0,
        valid: 0,
      };
      stepCounts.set(step.stepId, {
        total: current.total + 1,
        valid: current.valid + (step.valid ? 1 : 0),
      });
    });
  });

  stepCounts.forEach((counts, stepId) => {
    const rate = (counts.valid / counts.total) * 100;
    stepCompletionRates.set(stepId, rate);
  });

  return {
    totalExecutions,
    successRate,
    averageDuration,
    stepCompletionRates,
  };
}
```

### 차트 컴포넌트

```typescript
// apps/dashboard/src/components/ExecutionChart.tsx
import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  type ChartData,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import type { Statistics } from '../services/statistics';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ExecutionChartProps {
  statistics: Statistics;
}

export function ExecutionChart({ statistics }: ExecutionChartProps) {
  const chartData: ChartData<'bar'> = {
    labels: ['Total', 'Successful', 'Failed'],
    datasets: [
      {
        label: 'Executions',
        data: [
          statistics.totalExecutions,
          Math.round(
            (statistics.totalExecutions * statistics.successRate) /
              100
          ),
          Math.round(
            statistics.totalExecutions -
              (statistics.totalExecutions * statistics.successRate) /
                100
          ),
        ],
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',
          'rgba(34, 197, 94, 0.5)',
          'rgba(239, 68, 68, 0.5)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(34, 197, 94)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Process Execution Statistics',
      },
    },
  };

  return <Bar data={chartData} options={options} />;
}
```

## 공유 컴포넌트

### Button 컴포넌트

```typescript
// packages/shared-ui/src/Button.tsx
import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
}

const variantClasses = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900',
  destructive: 'bg-red-500 hover:bg-red-600 text-white',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
};

const sizeClasses = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const classes = [
    'rounded-lg font-medium transition-colors',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
```

### 폼 검증 Hook

```typescript
// packages/shared-utils/src/useFormValidation.ts
import { useState, useCallback } from 'react';
import { z, type ZodSchema } from 'zod';

export function useFormValidation<T extends ZodSchema>(schema: T) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = useCallback(
    (data: unknown) => {
      const result = schema.safeParse(data);

      if (result.success) {
        setErrors({});
        return { success: true, data: result.data };
      }

      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        const path = error.path.join('.');
        fieldErrors[path] = error.message;
      });

      setErrors(fieldErrors);
      return { success: false, errors: fieldErrors };
    },
    [schema]
  );

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  return {
    errors,
    validate,
    clearErrors,
    clearError,
  };
}

// 사용법
const processSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

function ProcessForm() {
  const { errors, validate } = useFormValidation(processSchema);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);

    const result = validate(data);
    if (result.success) {
      // 폼 제출
      console.log('Valid data:', result.data);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" />
      {errors.name && <span className="error">{errors.name}</span>}

      <button type="submit">Submit</button>
    </form>
  );
}
```

## 에러 처리

### Error Boundary

```typescript
// packages/shared-ui/src/ErrorBoundary.tsx
import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="error-boundary">
            <h2>Something went wrong</h2>
            <pre>{this.state.error?.message}</pre>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

---

마지막 섹션에서 모범 사례와 코딩 가이드라인을 알아봅니다.
