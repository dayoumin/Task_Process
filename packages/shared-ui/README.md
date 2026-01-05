# @task-process/shared-ui

Shared UI component library for Task Process applications (Builder & Dashboard).

## Components

### Button
Reusable button component with variants and sizes.

```tsx
import { Button } from '@task-process/shared-ui';

<Button variant="primary" size="md">Click me</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'

### Input
Form input field with label, error handling, and helper text.

```tsx
import { Input } from '@task-process/shared-ui';

<Input
  label="Email"
  type="email"
  error="Invalid email"
  required
  fullWidth
/>
```

**Props:**
- `label`: Optional label text
- `error`: Error message
- `helperText`: Helper text
- `variant`: 'default' | 'small'
- `fullWidth`: Boolean to make input full width

### Select
Dropdown select component with options.

```tsx
import { Select } from '@task-process/shared-ui';

<Select
  label="Choose option"
  options={[
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' }
  ]}
  placeholder="Select..."
/>
```

**Props:**
- `label`: Optional label text
- `options`: Array of SelectOption
- `error`: Error message
- `variant`: 'default' | 'small'
- `fullWidth`: Boolean

### Card
Flexible card container with header, body, and footer.

```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@task-process/shared-ui';

<Card variant="elevated" padding="md">
  <CardHeader title="Card Title" subtitle="Subtitle" />
  <CardBody>Content goes here</CardBody>
  <CardFooter align="right">
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Props:**
- `variant`: 'default' | 'bordered' | 'elevated'
- `padding`: 'none' | 'sm' | 'md' | 'lg'
- `rounded`: Boolean

### Modal
Modal dialog with overlay and customizable content.

```tsx
import { Modal, ModalFooter } from '@task-process/shared-ui';

<Modal
  isOpen={true}
  onClose={() => {}}
  title="Modal Title"
  size="md"
  footer={
    <ModalFooter>
      <Button>Close</Button>
    </ModalFooter>
  }
>
  Modal content
</Modal>
```

**Props:**
- `isOpen`: Boolean
- `onClose`: Function
- `title`: Optional title
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `closeOnOverlayClick`: Boolean (default: true)
- `showCloseButton`: Boolean (default: true)

### Spinner
Loading spinner with multiple variants.

```tsx
import { Spinner, LoadingOverlay, FullPageSpinner } from '@task-process/shared-ui';

// Basic spinner
<Spinner size="md" color="primary" />

// Loading overlay
<LoadingOverlay isLoading={true} message="Loading...">
  <YourContent />
</LoadingOverlay>

// Full page spinner
<FullPageSpinner message="Loading application..." />
```

**Props:**
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `color`: 'primary' | 'secondary' | 'white' | 'current'
- `label`: Accessibility label

### ErrorBoundary
React error boundary component for catching errors.

```tsx
import { ErrorBoundary } from '@task-process/shared-ui';

<ErrorBoundary
  showDetails={true}
  onError={(error, errorInfo) => console.error(error)}
>
  <App />
</ErrorBoundary>
```

**Props:**
- `showDetails`: Show error stack trace (default: false)
- `onError`: Callback function
- `fallback`: Custom error UI

## Installation

This package is internal to the monorepo. It's automatically available to apps via workspace dependencies.

```json
{
  "dependencies": {
    "@task-process/shared-ui": "workspace:*"
  }
}
```

## Usage in Apps

### Builder (apps/builder)
```tsx
import { Input, Card, Modal } from '@task-process/shared-ui';
```

### Dashboard (apps/dashboard)
```tsx
import { Button, Spinner, ErrorBoundary } from '@task-process/shared-ui';
```

## Development

```bash
# Build the package
pnpm --filter @task-process/shared-ui build

# Watch mode for development
pnpm --filter @task-process/shared-ui dev

# Type check
pnpm --filter @task-process/shared-ui type-check
```

## Styling

All components use Tailwind CSS classes. Make sure your app has Tailwind configured with the shared config:

```js
// tailwind.config.js
import sharedConfig from '@task-process/config-tailwind';
export default sharedConfig;
```

## Accessibility

All components follow accessibility best practices:
- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- Focus management
- Semantic HTML

## TypeScript

Full TypeScript support with exported types for all components.

```tsx
import type { ButtonProps, InputProps } from '@task-process/shared-ui';
```
