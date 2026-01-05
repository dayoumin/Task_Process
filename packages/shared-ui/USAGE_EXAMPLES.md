# Shared UI Components - Usage Examples

This document shows practical examples of how to use the shared UI components in Builder and Dashboard apps.

## Migration Guide

### Before (Duplicated Code)
Previously, both apps had their own ErrorBoundary implementations and inline form components.

### After (Shared Components)
Import from the shared package:

```tsx
import {
  Button,
  Input,
  Select,
  Card,
  Modal,
  Spinner,
  ErrorBoundary
} from '@task-process/shared-ui';
```

---

## Example 1: Form with Input and Select (Builder)

**Use Case:** Node editor form in Builder

```tsx
import { Input, Select } from '@task-process/shared-ui';
import type { SelectOption } from '@task-process/shared-ui';

function NodeEditor() {
  const typeOptions: SelectOption[] = [
    { value: 'task', label: 'Task Node' },
    { value: 'condition', label: 'Condition Node' },
    { value: 'end', label: 'End Node' }
  ];

  return (
    <div className="space-y-4">
      <Input
        label="Node Title"
        placeholder="Enter node title..."
        variant="small"
        fullWidth
        required
      />

      <Input
        label="Description"
        placeholder="Describe this node..."
        variant="small"
        fullWidth
      />

      <Select
        label="Node Type"
        options={typeOptions}
        variant="small"
        fullWidth
        required
      />
    </div>
  );
}
```

---

## Example 2: Card-based Stats (Dashboard)

**Use Case:** Statistics cards in Dashboard

```tsx
import { Card, CardHeader, CardBody } from '@task-process/shared-ui';
import { TrendingUp } from 'lucide-react';

function StatsPanel() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <Card variant="elevated" padding="md">
        <CardHeader
          title="Total Processes"
          action={<TrendingUp className="text-blue-600" />}
        />
        <CardBody>
          <p className="text-3xl font-bold">1,234</p>
          <p className="text-sm text-gray-500">+12% from last month</p>
        </CardBody>
      </Card>

      <Card variant="elevated" padding="md">
        <CardHeader title="Completion Rate" />
        <CardBody>
          <p className="text-3xl font-bold">87%</p>
          <p className="text-sm text-gray-500">Above target</p>
        </CardBody>
      </Card>

      <Card variant="elevated" padding="md">
        <CardHeader title="Active Users" />
        <CardBody>
          <p className="text-3xl font-bold">456</p>
          <p className="text-sm text-gray-500">Currently online</p>
        </CardBody>
      </Card>
    </div>
  );
}
```

---

## Example 3: Modal Dialog (Builder & Dashboard)

**Use Case:** Export confirmation modal

```tsx
import { Modal, ModalFooter, Button } from '@task-process/shared-ui';
import { useState } from 'react';

function ExportDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = () => {
    // Export logic
    setIsOpen(false);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Export</Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Export Process"
        size="md"
        footer={
          <ModalFooter align="right">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleExport}>
              Export
            </Button>
          </ModalFooter>
        }
      >
        <p>Are you sure you want to export this process?</p>
        <p className="text-sm text-gray-600 mt-2">
          This will generate a JSON file with all process data.
        </p>
      </Modal>
    </>
  );
}
```

---

## Example 4: Loading States (Dashboard)

**Use Case:** File upload with loading indicator

```tsx
import { LoadingOverlay, Spinner } from '@task-process/shared-ui';
import { useState } from 'react';

function FileUploadArea() {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (files: FileList) => {
    setIsUploading(true);
    try {
      // Upload logic
      await uploadFiles(files);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <LoadingOverlay
      isLoading={isUploading}
      message="Uploading files..."
      spinnerSize="lg"
    >
      <div className="border-2 border-dashed p-8 text-center">
        <p>Drag and drop files here</p>
        <input type="file" onChange={(e) => handleUpload(e.target.files)} />
      </div>
    </LoadingOverlay>
  );
}
```

---

## Example 5: Error Boundary (App Level)

**Use Case:** Wrap entire application

```tsx
import { ErrorBoundary } from '@task-process/shared-ui';
import App from './App';

function Root() {
  return (
    <ErrorBoundary
      showDetails={import.meta.env.DEV}
      onError={(error, errorInfo) => {
        // Send to error tracking service
        console.error('App error:', error, errorInfo);
      }}
    >
      <App />
    </ErrorBoundary>
  );
}

export default Root;
```

---

## Example 6: Form with Validation

**Use Case:** Filter form with error handling

```tsx
import { Input, Select, Button, Card } from '@task-process/shared-ui';
import { useState } from 'react';

function FilterForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Submit logic
    }
  };

  return (
    <Card variant="bordered" padding="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Start Date"
          type="date"
          error={errors.startDate}
          fullWidth
          required
        />

        <Input
          label="End Date"
          type="date"
          fullWidth
        />

        <Select
          label="Department"
          options={departments}
          placeholder="Select department..."
          fullWidth
        />

        <Button type="submit" variant="primary" size="lg">
          Apply Filters
        </Button>
      </form>
    </Card>
  );
}
```

---

## Example 7: Inline Spinner (Builder)

**Use Case:** Button loading state

```tsx
import { Button, Spinner } from '@task-process/shared-ui';
import { useState } from 'react';

function SaveButton() {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveProcess();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button onClick={handleSave} disabled={isSaving}>
      {isSaving ? (
        <>
          <Spinner size="sm" color="white" />
          <span className="ml-2">Saving...</span>
        </>
      ) : (
        'Save Process'
      )}
    </Button>
  );
}
```

---

## Example 8: Nested Cards (Dashboard)

**Use Case:** Complex dashboard layout

```tsx
import { Card, CardHeader, CardBody, CardFooter, Button } from '@task-process/shared-ui';

function DashboardPanel() {
  return (
    <Card variant="elevated" padding="lg">
      <CardHeader
        title="Process Analytics"
        subtitle="Last 30 days"
        action={
          <Button variant="outline" size="sm">
            Export
          </Button>
        }
      />

      <CardBody>
        <div className="grid grid-cols-2 gap-4">
          <Card variant="bordered" padding="md">
            <CardBody>
              <p className="text-sm text-gray-600">Completion Rate</p>
              <p className="text-2xl font-bold">94.5%</p>
            </CardBody>
          </Card>

          <Card variant="bordered" padding="md">
            <CardBody>
              <p className="text-sm text-gray-600">Avg Duration</p>
              <p className="text-2xl font-bold">2.3h</p>
            </CardBody>
          </Card>
        </div>
      </CardBody>

      <CardFooter align="right">
        <Button variant="ghost" size="sm">
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
```

---

## Best Practices

### 1. Always Use fullWidth for Form Fields
```tsx
<Input label="Email" fullWidth /> // ✅ Good
<Input label="Email" />           // ❌ May cause layout issues
```

### 2. Provide Accessible Labels
```tsx
<Input label="Username" required /> // ✅ Good
<Input placeholder="Username" />    // ❌ Not accessible
```

### 3. Use Proper Button Variants
```tsx
<Button variant="primary">Save</Button>     // Primary actions
<Button variant="outline">Cancel</Button>   // Secondary actions
<Button variant="ghost">Details</Button>    // Tertiary actions
```

### 4. Handle Loading States
```tsx
<LoadingOverlay isLoading={loading}>
  <YourContent />
</LoadingOverlay>
```

### 5. Error Handling
```tsx
<ErrorBoundary showDetails={isDevelopment}>
  <Component />
</ErrorBoundary>
```

---

## Common Patterns

### Search Filter Panel
```tsx
import { Card, Input, Select, Button } from '@task-process/shared-ui';

<Card variant="bordered" padding="md">
  <div className="flex gap-2">
    <Input placeholder="Search..." fullWidth />
    <Select options={filters} placeholder="Filter by..." />
    <Button variant="outline">Search</Button>
  </div>
</Card>
```

### Action Modal
```tsx
import { Modal, ModalFooter, Button } from '@task-process/shared-ui';

<Modal isOpen={open} onClose={close} title="Confirm Action">
  <p>Are you sure?</p>
  <ModalFooter>
    <Button variant="outline" onClick={close}>Cancel</Button>
    <Button variant="primary" onClick={confirm}>Confirm</Button>
  </ModalFooter>
</Modal>
```

### Stats Grid
```tsx
import { Card, CardBody } from '@task-process/shared-ui';

<div className="grid grid-cols-4 gap-4">
  {stats.map(stat => (
    <Card key={stat.id} variant="elevated">
      <CardBody>
        <p className="text-sm">{stat.label}</p>
        <p className="text-3xl font-bold">{stat.value}</p>
      </CardBody>
    </Card>
  ))}
</div>
```
