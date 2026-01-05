# Monorepo Structure

Learn how the Task Process monorepo is organized and how to work with shared packages.

## Why Monorepo?

A monorepo (monolithic repository) provides several benefits:

- **Code Sharing**: Share code between applications without publishing packages
- **Consistent Dependencies**: Single version of dependencies across all apps
- **Atomic Changes**: Make changes across multiple packages in a single commit
- **Simplified Development**: One repository to clone and maintain

## Workspace Configuration

The project uses **pnpm workspaces** for package management.

### pnpm-workspace.yaml

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
```

This configuration tells pnpm to treat all directories in `apps/` and `packages/` as separate workspaces.

## Package Structure

### Applications (`apps/`)

Applications are the end-user facing products. Each app has its own:

- **package.json** with dependencies
- **vite.config.ts** for build configuration
- **src/** directory with source code
- **dist/** directory (generated) for production build

Example structure:

```
apps/builder/
├── src/
│   ├── components/
│   ├── routes/
│   ├── store/
│   └── main.tsx
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### Shared Packages (`packages/`)

Shared packages provide reusable code across applications.

#### shared-types

TypeScript type definitions and Zod schemas.

```typescript
// packages/shared-types/src/process.ts
export interface Process {
  id: string;
  name: string;
  steps: Step[];
}
```

Usage in apps:

```typescript
import type { Process } from '@task-process/shared-types';
```

#### shared-ui

React components used across multiple apps.

```typescript
// packages/shared-ui/src/Button.tsx
export function Button({ children, ...props }: ButtonProps) {
  return <button {...props}>{children}</button>;
}
```

Usage:

```typescript
import { Button } from '@task-process/shared-ui';
```

#### shared-utils

Utility functions and helpers.

```typescript
// packages/shared-utils/src/format.ts
export function formatDate(date: Date): string {
  return date.toLocaleDateString();
}
```

Usage:

```typescript
import { formatDate } from '@task-process/shared-utils';
```

## Dependency Management

### Workspace Dependencies

Use `workspace:*` protocol in package.json:

```json
{
  "dependencies": {
    "@task-process/shared-types": "workspace:*",
    "@task-process/shared-ui": "workspace:*"
  }
}
```

This ensures local packages are linked during development.

### External Dependencies

External dependencies are managed at the root level when possible:

```json
{
  "pnpm": {
    "overrides": {
      "react": "19.2.3",
      "react-dom": "19.2.3"
    }
  }
}
```

## Build System

### Turbo Configuration

Turbo orchestrates builds across the monorepo:

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

### Build Order

1. **shared-types** builds first (other packages depend on it)
2. **shared-ui** and **shared-utils** build next
3. **Applications** build last

Run all builds:

```bash
pnpm build
```

Run specific app:

```bash
pnpm --filter @task-process/builder build
```

## Development Workflow

### Installing Dependencies

```bash
# Install all dependencies
pnpm install

# Add dependency to specific package
pnpm --filter @task-process/builder add lucide-react
```

### Running Development Servers

```bash
# Start all dev servers
pnpm dev

# Start specific app
pnpm --filter @task-process/builder dev
```

### Type Checking

```bash
# Type check all packages
pnpm type-check

# Type check specific package
pnpm --filter @task-process/shared-types type-check
```

## Best Practices

### 1. Use Workspace References

Always use workspace references for internal packages:

```json
"@task-process/shared-types": "workspace:*"
```

### 2. Build Shared Packages First

Before working on apps, ensure shared packages are built:

```bash
pnpm --filter @task-process/shared-types build
```

### 3. Avoid Circular Dependencies

Don't create circular dependencies between packages:

```
❌ shared-types → shared-ui → shared-types
✅ shared-types → shared-ui
```

### 4. Keep Versions Consistent

Use pnpm overrides to ensure consistent versions:

```json
{
  "pnpm": {
    "overrides": {
      "typescript": "5.7.2"
    }
  }
}
```

### 5. Use Path Aliases Sparingly

Prefer explicit imports over path aliases for clarity:

```typescript
// ✅ Good
import { Process } from '@task-process/shared-types';

// ❌ Avoid
import { Process } from '@/types';
```

## Common Tasks

### Adding a New Package

1. Create directory in `packages/`
2. Add `package.json` with `@task-process/` scope
3. Add to workspace in `pnpm-workspace.yaml` (automatic with `packages/*`)
4. Run `pnpm install`

### Adding a New App

1. Create directory in `apps/`
2. Add `package.json`, `vite.config.ts`, etc.
3. Add workspace dependencies
4. Run `pnpm install`

### Updating Dependencies

```bash
# Update all dependencies
pnpm update

# Update specific dependency
pnpm update react react-dom
```

## Troubleshooting

### Module Not Found

If you get module not found errors:

1. Ensure shared package is built: `pnpm build`
2. Clear node_modules: `pnpm clean && pnpm install`
3. Restart TypeScript server in your IDE

### Type Errors

If TypeScript can't find types:

1. Build shared-types: `pnpm --filter @task-process/shared-types build`
2. Check tsconfig.json references
3. Restart IDE

### Build Failures

If builds fail:

1. Check build order (shared packages first)
2. Clear Turbo cache: `rm -rf .turbo`
3. Run clean build: `pnpm clean && pnpm install && pnpm build`

---

Next, learn about the type system and how types are shared across the monorepo.
