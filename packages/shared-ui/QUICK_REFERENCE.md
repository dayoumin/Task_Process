# Shared UI - Quick Reference Card

## Import
```tsx
import { Component } from '@task-process/shared-ui';
import type { ComponentProps } from '@task-process/shared-ui';
```

---

## Components Cheat Sheet

### Button
```tsx
<Button variant="primary|secondary|outline|ghost" size="sm|md|lg">
  Click me
</Button>
```

### Input
```tsx
<Input
  label="Label"
  error="Error message"
  variant="default|small"
  fullWidth
  required
/>
```

### Select
```tsx
<Select
  label="Label"
  options={[{value: '1', label: 'One'}]}
  placeholder="Choose..."
  fullWidth
/>
```

### Card
```tsx
<Card variant="default|bordered|elevated" padding="none|sm|md|lg">
  <CardHeader title="Title" subtitle="Subtitle" action={<Button/>} />
  <CardBody>Content</CardBody>
  <CardFooter align="left|center|right">Actions</CardFooter>
</Card>
```

### Modal
```tsx
<Modal
  isOpen={open}
  onClose={close}
  title="Title"
  size="sm|md|lg|xl"
  footer={<ModalFooter>Actions</ModalFooter>}
>
  Content
</Modal>
```

### Spinner
```tsx
<Spinner size="xs|sm|md|lg|xl" color="primary|secondary|white|current" />

<LoadingOverlay isLoading={true} message="Loading...">
  <Content />
</LoadingOverlay>

<FullPageSpinner message="Loading app..." />
```

### ErrorBoundary
```tsx
<ErrorBoundary showDetails={true} onError={(err, info) => log(err)}>
  <App />
</ErrorBoundary>
```

---

## Common Patterns

### Form
```tsx
<div className="space-y-4">
  <Input label="Name" required fullWidth />
  <Select label="Type" options={opts} fullWidth />
  <Button type="submit">Submit</Button>
</div>
```

### Stats Card
```tsx
<Card variant="elevated" padding="md">
  <CardBody>
    <p className="text-sm text-gray-600">Label</p>
    <p className="text-3xl font-bold">Value</p>
  </CardBody>
</Card>
```

### Confirmation Modal
```tsx
<Modal isOpen={open} onClose={close} title="Confirm">
  <p>Are you sure?</p>
  <ModalFooter>
    <Button variant="outline" onClick={close}>Cancel</Button>
    <Button onClick={confirm}>Confirm</Button>
  </ModalFooter>
</Modal>
```

### Loading State
```tsx
<Button disabled={loading}>
  {loading && <Spinner size="sm" color="white" />}
  {loading ? 'Saving...' : 'Save'}
</Button>
```

---

## Accessibility

- All components have ARIA labels
- Keyboard navigation supported
- Focus management in modals
- Screen reader friendly
- Error announcements

---

## TypeScript

All components are fully typed:
```tsx
import type {
  ButtonProps,
  InputProps,
  SelectProps,
  CardProps,
  ModalProps,
  SpinnerProps,
  ErrorBoundaryProps
} from '@task-process/shared-ui';
```

---

## Development

```bash
# Build
pnpm --filter @task-process/shared-ui build

# Watch
pnpm --filter @task-process/shared-ui dev

# Type check
pnpm --filter @task-process/shared-ui type-check
```
