# Project Hub

Interactive documentation and learning center for the Task Process monorepo.

## Overview

Project Hub is a comprehensive documentation application that provides:

- **Dashboard**: Overview of all apps and packages
- **Design System**: Showcase of shared UI components
- **Learning Center**: Interactive tutorials and guides
- **Architecture**: System diagrams and structure visualization

## Features

- Interactive Markdown tutorials with syntax highlighting
- Mermaid diagram rendering for architecture visualization
- Responsive design with dark mode support
- Real-time navigation between learning topics
- Design system component showcase
- Build statistics and package information

## Getting Started

### Development

```bash
# Install dependencies
pnpm install

# Start development server (port 5176)
pnpm --filter @task-process/project-hub dev

# Or from the app directory
cd apps/project-hub
pnpm dev
```

The app will be available at http://localhost:5176

### Build

```bash
# Build for production
pnpm --filter @task-process/project-hub build

# Preview production build
pnpm --filter @task-process/project-hub preview
```

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **React Markdown** - Markdown rendering
- **Prism React Renderer** - Code syntax highlighting
- **Mermaid** - Diagram rendering
- **Lucide Icons** - Icon library

## Project Structure

```
apps/project-hub/
├── src/
│   ├── routes/              # Page components
│   │   ├── Dashboard.tsx
│   │   ├── DesignSystem.tsx
│   │   ├── Learning.tsx
│   │   └── Architecture.tsx
│   ├── components/
│   │   └── layout/          # Layout components
│   │       ├── Layout.tsx
│   │       ├── Sidebar.tsx
│   │       └── Header.tsx
│   ├── content/
│   │   ├── learning/        # Markdown tutorials
│   │   │   ├── 01-introduction.md
│   │   │   ├── 02-monorepo-structure.md
│   │   │   ├── 03-type-system.md
│   │   │   ├── 04-ai-testing.md
│   │   │   ├── 05-real-examples.md
│   │   │   └── 06-best-practices.md
│   │   └── diagrams/        # Mermaid diagrams
│   │       ├── monorepo-structure.mmd
│   │       ├── dependency-graph.mmd
│   │       ├── data-flow.mmd
│   │       └── test-workflow.mmd
│   ├── data/
│   │   ├── packages.json    # Package metadata
│   │   └── navigation.ts    # Navigation structure
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   └── data/
│       └── build-stats.json # Build statistics
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

## Learning Content

The Learning Center includes the following topics:

1. **Introduction** - Overview of the Task Process system
2. **Monorepo Structure** - Understanding pnpm workspaces
3. **Type System** - TypeScript and Zod usage
4. **AI Testing** - Testing strategies with Vitest and Playwright
5. **Real Examples** - Practical code examples
6. **Best Practices** - Coding standards and patterns

## Adding New Content

### Adding a Learning Topic

1. Create a new markdown file in `src/content/learning/`
2. Add the topic to the `topics` array in `src/routes/Learning.tsx`
3. Update navigation in `src/data/navigation.ts`

Example:

```typescript
// src/routes/Learning.tsx
const topics = [
  // ... existing topics
  { id: '07-new-topic', title: 'New Topic', file: '07-new-topic.md' },
];
```

### Adding a Diagram

1. Create a new Mermaid file in `src/content/diagrams/`
2. Add the diagram to the `diagrams` array in `src/routes/Architecture.tsx`

Example:

```typescript
// src/routes/Architecture.tsx
const diagrams = [
  // ... existing diagrams
  { id: 'new-diagram', title: 'New Diagram', file: 'new-diagram.mmd' },
];
```

## Dependencies

### Shared Packages

- `@task-process/shared-types` - Common TypeScript types
- `@task-process/shared-ui` - Reusable React components
- `@task-process/shared-utils` - Utility functions

### External Dependencies

- `react-router-dom` - Routing
- `react-markdown` - Markdown parsing
- `remark-gfm` - GitHub Flavored Markdown
- `prism-react-renderer` - Code highlighting
- `mermaid` - Diagram rendering
- `lucide-react` - Icons

## Configuration

### Vite Configuration

The Vite config is set up to:
- Use React plugin
- Run on port 5176
- Generate sourcemaps
- Optimize for production

### TypeScript Configuration

TypeScript is configured with:
- Strict mode enabled
- React JSX support
- Path resolution for imports
- Source maps enabled

### Tailwind Configuration

Custom Tailwind setup with:
- Dark mode support
- Custom color palette
- Responsive breakpoints
- Custom markdown styles

## Troubleshooting

### Build Errors

If you encounter build errors:

1. Clean and reinstall dependencies:
   ```bash
   rm -rf node_modules dist
   pnpm install
   ```

2. Rebuild shared packages:
   ```bash
   pnpm --filter @task-process/shared-types build
   pnpm --filter @task-process/shared-ui build
   ```

3. Clear Vite cache:
   ```bash
   rm -rf .vite
   ```

### Development Server Issues

If the dev server won't start:

1. Check if port 5176 is in use
2. Try a different port:
   ```bash
   pnpm dev --port 5177
   ```

## License

Private - Part of Task Process monorepo

## Support

For issues or questions, refer to the main [Task Process documentation](../../README.md).
