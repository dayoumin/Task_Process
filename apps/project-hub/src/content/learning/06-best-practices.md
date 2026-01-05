# Best Practices

Essential guidelines and best practices for developing in the Task Process monorepo.

## Code Organization

### File Structure

Follow a consistent file structure across all packages:

```
src/
├── components/      # React components
│   ├── ui/         # Reusable UI components
│   └── features/   # Feature-specific components
├── hooks/          # Custom React hooks
├── routes/         # Page components
├── store/          # State management
├── services/       # Business logic
├── utils/          # Utility functions
├── types/          # TypeScript type definitions
└── main.tsx        # Entry point
```

### Naming Conventions

```typescript
// ✅ Components: PascalCase
export function ProcessList() {}
export function UserProfile() {}

// ✅ Functions/Variables: camelCase
const processCount = 42;
function calculateTotal() {}

// ✅ Constants: UPPER_SNAKE_CASE
const MAX_RETRIES = 3;
const API_BASE_URL = '/api';

// ✅ Types/Interfaces: PascalCase
interface ProcessData {}
type ProcessStatus = 'active' | 'inactive';

// ✅ Files: Match export name
ProcessList.tsx        // exports ProcessList
useProcessData.ts      // exports useProcessData
formatDate.ts          // exports formatDate
```

### Import Organization

```typescript
// 1. External dependencies
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// 2. Internal packages
import type { Process } from '@task-process/shared-types';
import { Button } from '@task-process/shared-ui';
import { formatDate } from '@task-process/shared-utils';

// 3. Relative imports
import { useProcessStore } from '../store/processStore';
import { ProcessCard } from './ProcessCard';
import type { LocalType } from './types';
```

## Component Design

### Component Structure

```typescript
// 1. Imports
import { useState } from 'react';
import type { Process } from '@task-process/shared-types';

// 2. Types
interface ProcessCardProps {
  process: Process;
  onEdit?: (process: Process) => void;
  className?: string;
}

// 3. Component
export function ProcessCard({
  process,
  onEdit,
  className = '',
}: ProcessCardProps) {
  // 4. Hooks
  const [isExpanded, setIsExpanded] = useState(false);

  // 5. Event handlers
  const handleEdit = () => {
    onEdit?.(process);
  };

  // 6. Render
  return (
    <div className={`process-card ${className}`}>
      <h3>{process.name}</h3>
      {isExpanded && <p>{process.description}</p>}
      <button onClick={handleEdit}>Edit</button>
    </div>
  );
}
```

### Props Design

```typescript
// ✅ Good: Explicit, typed props
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  children: ReactNode;
}

// ❌ Avoid: Unclear props
interface ButtonProps {
  type?: string;
  data?: any;
  handler?: Function;
}
```

### Component Composition

```typescript
// ✅ Good: Composable components
<Card>
  <Card.Header>
    <Card.Title>Process Details</Card.Title>
  </Card.Header>
  <Card.Body>
    <ProcessInfo process={process} />
  </Card.Body>
</Card>

// ❌ Avoid: Monolithic components
<Card
  title="Process Details"
  showHeader={true}
  headerProps={...}
  bodyContent={<ProcessInfo />}
/>
```

## State Management

### Local State

Use local state for component-specific data:

```typescript
function ProcessForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  // Component-specific state
}
```

### Global State (Zustand)

Use Zustand for shared state:

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

### When to Use Which

```typescript
// ✅ Local state: Form inputs, UI toggles, temporary data
const [isOpen, setIsOpen] = useState(false);

// ✅ Global state: User data, shared resources, app config
const { user, setUser } = useAuthStore();

// ✅ URL state: Filters, pagination, search
const [searchParams] = useSearchParams();
const page = searchParams.get('page');

// ✅ Server state: API data (use React Query/SWR)
const { data: processes } = useQuery('processes', fetchProcesses);
```

## Performance Optimization

### Memoization

```typescript
import { useMemo, useCallback, memo } from 'react';

// Memoize expensive calculations
function ProcessList({ processes }: ProcessListProps) {
  const sortedProcesses = useMemo(
    () => processes.sort((a, b) => a.name.localeCompare(b.name)),
    [processes]
  );

  // Memoize callbacks
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

// Memoize components
export const ProcessCard = memo(function ProcessCard({
  process,
  onSelect,
}: ProcessCardProps) {
  return <div onClick={() => onSelect(process.id)}>{process.name}</div>;
});
```

### Code Splitting

```typescript
import { lazy, Suspense } from 'react';

// Lazy load route components
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

### Virtualization

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

## Error Handling

### Graceful Degradation

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
// Wrap critical sections
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

## Accessibility

### Semantic HTML

```typescript
// ✅ Good: Semantic elements
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

// ❌ Avoid: Non-semantic divs
<div className="nav">
  <div className="list">
    <div className="item">Home</div>
  </div>
</div>
```

### ARIA Attributes

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

### Keyboard Navigation

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

## Security

### Input Validation

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

### Sanitization

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

### Environment Variables

```typescript
// ✅ Good: Use import.meta.env
const apiUrl = import.meta.env.VITE_API_URL;

// ❌ Never commit secrets
const apiKey = 'hardcoded-secret'; // DON'T DO THIS

// Use .env.local for secrets (gitignored)
// .env.local
// VITE_API_KEY=your-secret-key
```

## Testing

### Test Coverage Goals

- **Unit Tests**: 80%+ coverage for utilities and services
- **Component Tests**: Critical user flows
- **E2E Tests**: Main user journeys
- **Type Tests**: Ensure TypeScript catches issues

### Test Organization

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

## Documentation

### Code Comments

```typescript
// ✅ Good: Explain WHY, not WHAT
// Using setTimeout to defer execution after render completes
// This prevents layout thrashing in Safari
setTimeout(() => updateLayout(), 0);

// ❌ Avoid: Obvious comments
// Set name to value
setName(value);
```

### JSDoc for Public APIs

```typescript
/**
 * Validates a process against the schema
 *
 * @param process - The process to validate
 * @returns Validation result with errors if any
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
  // implementation
}
```

## Git Workflow

### Commit Messages

```bash
# Format: type(scope): description

feat(builder): add step reordering
fix(executor): handle null process data
docs(readme): update installation steps
refactor(shared-ui): simplify Button component
test(dashboard): add statistics tests
chore(deps): upgrade React to 19.2.3
```

### Branch Naming

```bash
# Format: type/description

feature/process-templates
fix/validation-error
refactor/state-management
docs/api-documentation
```

## Common Anti-Patterns to Avoid

### 1. Prop Drilling

```typescript
// ❌ Avoid
<Parent user={user}>
  <Middle user={user}>
    <Child user={user} />
  </Middle>
</Parent>

// ✅ Use Context or Store
const user = useAuthStore((s) => s.user);
```

### 2. Large Components

```typescript
// ❌ Avoid: 500+ line components
function ProcessPage() {
  // Hundreds of lines of code
}

// ✅ Extract smaller components
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

### 3. Magic Numbers

```typescript
// ❌ Avoid
if (status === 1) { /* ... */ }
setTimeout(callback, 3000);

// ✅ Use named constants
const STATUS_ACTIVE = 1;
const DEBOUNCE_DELAY_MS = 3000;

if (status === STATUS_ACTIVE) { /* ... */ }
setTimeout(callback, DEBOUNCE_DELAY_MS);
```

### 4. Boolean Props Overload

```typescript
// ❌ Avoid
<Button
  isPrimary
  isLarge
  isDisabled
  hasIcon
  isRounded
/>

// ✅ Use variants and size
<Button
  variant="primary"
  size="lg"
  disabled
  icon={<Icon />}
/>
```

### 5. Premature Optimization

```typescript
// ❌ Avoid: Optimizing too early
const expensiveValue = useMemo(() => props.value * 2, [props.value]);

// ✅ Optimize when needed
// First, make it work. Then measure. Then optimize if needed.
const value = props.value * 2;
```

## Review Checklist

Before submitting a PR:

- [ ] Code follows naming conventions
- [ ] TypeScript strict mode passes
- [ ] All tests pass
- [ ] No console.log statements
- [ ] Imports are organized
- [ ] Components are properly typed
- [ ] Error cases are handled
- [ ] Accessibility considered
- [ ] Performance implications reviewed
- [ ] Documentation updated

---

Congratulations! You've completed the learning journey. Start building amazing features with the Task Process system.
