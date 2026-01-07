# 모범 사례 (Best Practices)

Task Process 모노레포에서 개발할 때의 필수 가이드라인과 모범 사례입니다.

## 코드 구성

### 파일 구조

모든 패키지에서 일관된 파일 구조를 따르세요:

```
src/
├── components/      # React 컴포넌트
│   ├── ui/         # 재사용 가능한 UI 컴포넌트
│   └── features/   # 기능별 컴포넌트
├── hooks/          # 커스텀 React hooks
├── routes/         # 페이지 컴포넌트
├── store/          # 상태 관리
├── services/       # 비즈니스 로직
├── utils/          # 유틸리티 함수
├── types/          # TypeScript 타입 정의
└── main.tsx        # 진입점
```

### 명명 규칙

```typescript
// ✅ 컴포넌트: PascalCase
export function ProcessList() {}
export function UserProfile() {}

// ✅ 함수/변수: camelCase
const processCount = 42;
function calculateTotal() {}

// ✅ 상수: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const API_BASE_URL = '/api';

// ✅ 타입/인터페이스: PascalCase
interface ProcessData {}
type ProcessStatus = 'active' | 'inactive';

// ✅ 파일: export 이름과 일치
ProcessList.tsx        // ProcessList를 export
useProcessData.ts      // useProcessData를 export
formatDate.ts          // formatDate를 export
```

### Import 구성

```typescript
// 1. 외부 의존성
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. 내부 패키지
import type { Process } from '@task-process/shared-types';
import { Button } from '@task-process/shared-ui';
import { formatDate } from '@task-process/shared-utils';

// 3. 상대 경로 import
import { useProcessStore } from '../store/processStore';
import { ProcessCard } from './ProcessCard';
import type { LocalType } from './types';
```

## 컴포넌트 설계

### 컴포넌트 구조

```typescript
// 1. Imports
import { useState } from 'react';
import type { Process } from '@task-process/shared-types';

// 2. 타입
interface ProcessCardProps {
  process: Process;
  onEdit?: (process: Process) => void;
  className?: string;
}

// 3. 컴포넌트
export function ProcessCard({
  process,
  onEdit,
  className = '',
}: ProcessCardProps) {
  // 4. Hooks
  const [isExpanded, setIsExpanded] = useState(false);

  // 5. 이벤트 핸들러
  const handleEdit = () => {
    onEdit?.(process);
  };

  // 6. 렌더링
  return (
    <div className={`process-card ${className}`}>
      <h3>{process.name}</h3>
      {isExpanded && <p>{process.description}</p>}
      <button onClick={handleEdit}>Edit</button>
    </div>
  );
}
```

### Props 설계

```typescript
// ✅ 좋음: 명시적이고 타입이 지정된 props
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  children: ReactNode;
}

// ❌ 피하기: 불명확한 props
interface ButtonProps {
  type?: string;
  data?: any;
  handler?: Function;
}
```

### 컴포넌트 조합

```typescript
// ✅ 좋음: 조합 가능한 컴포넌트
<Card>
  <Card.Header>
    <Card.Title>Process Details</Card.Title>
  </Card.Header>
  <Card.Body>
    <ProcessInfo process={process} />
  </Card.Body>
</Card>

// ❌ 피하기: 모놀리식 컴포넌트
<Card
  title="Process Details"
  showHeader={true}
  headerProps={...}
  bodyContent={<ProcessInfo />}
/>
```

## 상태 관리

### 로컬 상태

컴포넌트 특정 데이터에는 로컬 상태 사용:

```typescript
function ProcessForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // 컴포넌트 특정 상태
}
```

### 전역 상태 (Zustand)

공유 상태에는 Zustand 사용:

```typescript
// store/processStore.ts
import { create } from 'zustand';

interface ProcessState {
  processes: Process[];
  selectedId: string | null;

  setProcesses: (processes: Process[]) => void;
  selectProcess: (id: string) => void;
}

export const useProcessStore = create<ProcessState>((set) => ({
  processes: [],
  selectedId: null,

  setProcesses: (processes) => set({ processes }),
  selectProcess: (id) => set({ selectedId: id }),
}));
```

### 언제 무엇을 사용할까

```typescript
// ✅ 로컬 상태: 폼 입력, UI 토글, 임시 데이터
const [isOpen, setIsOpen] = useState(false);

// ✅ 전역 상태: 사용자 데이터, 공유 리소스, 앱 설정
const { user, setUser } = useAuthStore();

// ✅ URL 상태: 필터, 페이지네이션, 검색
const [searchParams] = useSearchParams();
const page = searchParams.get('page');

// ✅ 서버 상태: API 데이터 (React Query/SWR 사용)
const { data: processes } = useQuery('processes', fetchProcesses);
```

## 성능 최적화

### 메모이제이션 (Memoization)

```typescript
import { useMemo, useCallback, memo } from 'react';

// 비용이 큰 계산 메모이제이션
function ProcessList({ processes }: ProcessListProps) {
  const sortedProcesses = useMemo(
    () => processes.sort((a, b) => a.name.localeCompare(b.name)),
    [processes]
  );

  // 콜백 메모이제이션
  const handleSelect = useCallback(
    (id: string) => {
      console.log('Selected:', id);
    },
    []
  );

  return (
    <div>
      {sortedProcesses.map((p) => (
        <ProcessCard key={p.id} process={p} onSelect={handleSelect} />
      ))}
    </div>
  );
}

// 컴포넌트 메모이제이션
export const ProcessCard = memo(function ProcessCard({
  process,
  onSelect,
}: ProcessCardProps) {
  return <div onClick={() => onSelect(process.id)}>{process.name}</div>;
});
```

### 코드 분할 (Code Splitting)

```typescript
import { lazy, Suspense } from 'react';

// 라우트 컴포넌트 지연 로딩
const Dashboard = lazy(() => import('./routes/Dashboard'));
const ProcessBuilder = lazy(() => import('./routes/ProcessBuilder'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/builder" element={<ProcessBuilder />} />
      </Routes>
    </Suspense>
  );
}
```

### 가상화 (Virtualization)

```typescript
import { useVirtualizer } from '@tanstack/react-virtual';

function LargeList({ items }: { items: Process[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
  });

  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <ProcessCard process={items[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 에러 처리

### 우아한 성능 저하 (Graceful Degradation)

```typescript
function ProcessLoader({ id }: { id: string }) {
  const [process, setProcess] = useState<Process | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProcess(id)
      .then(setProcess)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to load process"
        message={error.message}
        retry={() => loadProcess(id)}
      />
    );
  }

  if (!process) {
    return <EmptyState message="Process not found" />;
  }

  return <ProcessDetails process={process} />;
}
```

### Error Boundaries

```typescript
// 중요한 섹션을 감싸기
<ErrorBoundary
  fallback={(error) => (
    <div>
      <h2>Process Builder Error</h2>
      <p>{error.message}</p>
      <button onClick={() => window.location.reload()}>
        Reload
      </button>
    </div>
  )}
>
  <ProcessBuilder />
</ErrorBoundary>
```

## 접근성 (Accessibility)

### 시맨틱 HTML

```typescript
// ✅ 좋음: 시맨틱 요소
<nav>
  <ul>
    <li><a href="/">Home</a></li>
  </ul>
</nav>

<main>
  <article>
    <h1>Title</h1>
    <p>Content</p>
  </article>
</main>

// ❌ 피하기: 비시맨틱 div
<div className="nav">
  <div className="list">
    <div className="item">Home</div>
  </div>
</div>
```

### ARIA 속성

```typescript
<button
  aria-label="Close dialog"
  aria-pressed={isPressed}
  onClick={handleClose}
>
  <X />
</button>

<div
  role="dialog"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <h2 id="dialog-title">Confirmation</h2>
  <p id="dialog-description">Are you sure?</p>
</div>
```

### 키보드 네비게이션

```typescript
function MenuItem({ item, onSelect }: MenuItemProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(item);
    }
  };

  return (
    <div
      role="menuitem"
      tabIndex={0}
      onClick={() => onSelect(item)}
      onKeyDown={handleKeyDown}
    >
      {item.label}
    </div>
  );
}
```

## 보안 (Security)

### 입력 검증

```typescript
import { z } from 'zod';

const ProcessInputSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  email: z.string().email().optional(),
});

function validateProcessInput(data: unknown) {
  return ProcessInputSchema.parse(data);
}
```

### 새니타이제이션 (Sanitization)

```typescript
import DOMPurify from 'dompurify';

function UserContent({ html }: { html: string }) {
  const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href'],
  });

  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
```

### 환경 변수

```typescript
// ✅ 좋음: import.meta.env 사용
const apiUrl = import.meta.env.VITE_API_URL;

// ❌ 절대 비밀 정보를 커밋하지 마세요
const apiKey = 'hardcoded-secret'; // 하지 마세요!

// 비밀 정보는 .env.local 사용 (gitignored)
// .env.local
// VITE_API_KEY=your-secret-key
```

## 테스팅

### 테스트 커버리지 목표

- **단위 테스트**: 유틸리티와 서비스에 대해 80% 이상 커버리지
- **컴포넌트 테스트**: 중요한 사용자 플로우
- **E2E 테스트**: 주요 사용자 여정
- **타입 테스트**: TypeScript가 이슈를 잡도록 보장

### 테스트 구성

```typescript
// ProcessList.test.tsx
describe('ProcessList', () => {
  describe('rendering', () => {
    it('displays processes', () => {});
    it('shows empty state', () => {});
  });

  describe('interactions', () => {
    it('selects process on click', () => {});
    it('opens menu on right click', () => {});
  });

  describe('edge cases', () => {
    it('handles null data', () => {});
    it('handles loading state', () => {});
  });
});
```

## 문서화

### 코드 주석

```typescript
// ✅ 좋음: 무엇이 아니라 왜를 설명
// setTimeout을 사용하여 렌더링 완료 후 실행을 연기
// Safari에서 레이아웃 쓰레싱을 방지합니다
setTimeout(() => updateLayout(), 0);

// ❌ 피하기: 명확한 주석
// name을 value로 설정
setName(value);
```

### 공개 API를 위한 JSDoc

```typescript
/**
 * 스키마에 대해 프로세스를 검증합니다
 *
 * @param process - 검증할 프로세스
 * @returns 오류가 있을 경우 오류를 포함한 검증 결과
 *
 * @example
 * ```ts
 * const result = validateProcess(myProcess);
 * if (!result.success) {
 *   console.error(result.errors);
 * }
 * ```
 */
export function validateProcess(
  process: unknown
): ValidationResult<Process> {
  // 구현
}
```

## Git 워크플로우

### 커밋 메시지

```bash
# 형식: type(scope): description

feat(builder): add step reordering
fix(executor): handle null process data
docs(readme): update installation steps
refactor(shared-ui): simplify Button component
test(dashboard): add statistics tests
chore(deps): upgrade React to 19.2.3
```

### 브랜치 명명

```bash
# 형식: type/description

feature/process-templates
fix/validation-error
refactor/state-management
docs/api-documentation
```

## 피해야 할 일반적인 안티패턴

### 1. Prop Drilling

```typescript
// ❌ 피하기
<Parent user={user}>
  <Middle user={user}>
    <Child user={user} />
  </Middle>
</Parent>

// ✅ Context나 Store 사용
const user = useAuthStore((s) => s.user);
```

### 2. 큰 컴포넌트

```typescript
// ❌ 피하기: 500줄 이상의 컴포넌트
function ProcessPage() {
  // 수백 줄의 코드
}

// ✅ 더 작은 컴포넌트로 분리
function ProcessPage() {
  return (
    <>
      <ProcessHeader />
      <ProcessList />
      <ProcessFooter />
    </>
  );
}
```

### 3. 매직 넘버

```typescript
// ❌ 피하기
if (status === 1) { /* ... */ }
setTimeout(callback, 3000);

// ✅ 명명된 상수 사용
const STATUS_ACTIVE = 1;
const DEBOUNCE_DELAY_MS = 3000;

if (status === STATUS_ACTIVE) { /* ... */ }
setTimeout(callback, DEBOUNCE_DELAY_MS);
```

### 4. Boolean Props 과다 사용

```typescript
// ❌ 피하기
<Button
  isPrimary
  isLarge
  isDisabled
  hasIcon
  isRounded
/>

// ✅ variant와 size 사용
<Button
  variant="primary"
  size="lg"
  disabled
  icon={<Icon />}
/>
```

### 5. 성급한 최적화

```typescript
// ❌ 피하기: 너무 일찍 최적화
const expensiveValue = useMemo(() => props.value * 2, [props.value]);

// ✅ 필요할 때 최적화
// 먼저 작동하게 만들고, 측정하고, 필요하면 최적화하세요
const value = props.value * 2;
```

## 리뷰 체크리스트

PR 제출 전:

- [ ] 코드가 명명 규칙을 따름
- [ ] TypeScript strict 모드 통과
- [ ] 모든 테스트 통과
- [ ] console.log 구문 없음
- [ ] import가 정리됨
- [ ] 컴포넌트가 올바르게 타입 지정됨
- [ ] 에러 케이스가 처리됨
- [ ] 접근성 고려됨
- [ ] 성능 영향 검토됨
- [ ] 문서 업데이트됨

---

축하합니다! 학습 과정을 완료했습니다. Task Process 시스템으로 놀라운 기능을 만들어보세요.
