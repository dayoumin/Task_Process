# Admin Builder - Development Documentation

## Overview
Admin Builder is a React Flow-based drag-and-drop process creation tool that generates JSON files compatible with User Executor.

## Technology Stack

### Core
- **React 19**: Latest React with concurrent features
- **TypeScript 5.9**: Type-safe development
- **Vite 7.3**: Ultra-fast build tool

### UI/UX
- **React Flow 11**: Drag-and-drop node-based editor
- **Tailwind CSS 4.1**: Utility-first styling
- **Lucide React**: Beautiful icon library

### State Management
- **Zustand 5.0**: Lightweight state management

## Project Structure

```
admin-builder/
├── src/
│   ├── components/
│   │   ├── ProcessBuilder.tsx       # Main canvas component
│   │   ├── nodes/                   # Custom node types
│   │   │   ├── StartNode.tsx        # Green start node
│   │   │   ├── TaskNode.tsx         # Blue task node
│   │   │   ├── ConditionNode.tsx    # Yellow condition node
│   │   │   └── EndNode.tsx          # Red end node
│   │   ├── sidebar/                 # Left sidebar components
│   │   │   ├── NodePalette.tsx      # Add node buttons
│   │   │   ├── NodeEditor.tsx       # Edit selected node
│   │   │   └── TrackingSettings.tsx # Process metadata
│   │   └── export/
│   │       └── ExportButton.tsx     # Validation & export
│   ├── stores/
│   │   └── process-store.ts         # Zustand store
│   ├── services/
│   │   ├── export-service.ts        # JSON generation
│   │   └── tracking-service.ts      # ID generators
│   ├── types/
│   │   ├── process.types.ts         # Process interfaces
│   │   └── tracking.types.ts        # Tracking interfaces
│   ├── App.tsx                      # Main layout
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Global styles
├── samples/                         # Example processes
├── package.json
└── vite.config.ts
```

## Key Components

### ProcessBuilder
Main canvas component using React Flow:
- Background grid
- Zoom/pan controls
- Minimap
- Custom node rendering

### Custom Nodes
Each node type has:
- Unique styling (color-coded)
- Input/output handles
- Data display
- Selection state

### NodeEditor
Right sidebar for editing selected node:
- Basic info (title, description)
- Checklist items (for task nodes)
- Input fields (for task nodes)
- Dynamic add/remove

### TrackingSettings
Process metadata configuration:
- Department selection
- Process type
- Assigned user (with auto-generation)
- Priority level
- Due date
- Estimated hours

### ExportButton
Validation and export:
- Graph validation (start/end nodes, connections)
- Tracking validation (required fields)
- JSON generation
- File download

## State Management

Using Zustand for simplicity:

```typescript
interface ProcessStore {
  // Metadata
  processName: string;
  processId: string;

  // React Flow state
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;

  // Tracking
  tracking: TrackingConfig;

  // Actions
  addNode: (type, position) => void;
  updateNodeData: (id, data) => void;
  onConnect: (connection) => void;
  // ... etc
}
```

## Services

### ExportService
Static methods for:
- **validateProcess**: Check graph structure
- **hasCycle**: Detect circular references
- **generateJSON**: Convert nodes to JSON
- **downloadFile**: Trigger browser download

### TrackingService
ID generators:
- **generateProcessId**: `PROC-YYYYMMDD-NNNN`
- **generateOrganizationId**: `CORP-YYYY`
- **generateUserId**: `USER-00000`

## Development Workflow

### 1. Local Development
```bash
pnpm dev
# → Starts on http://localhost:5174
```

Hot Module Replacement (HMR) enabled for instant updates.

### 2. Type Checking
```bash
tsc -b
# → Check TypeScript errors
```

### 3. Linting
```bash
pnpm lint
# → ESLint checks
```

### 4. Production Build
```bash
pnpm build
# → Creates dist/ folder
```

### 5. Preview Build
```bash
pnpm preview
# → Test production build locally
```

## JSON Output Format

Generated JSON follows this structure:

```json
{
  "id": "PROC-20260104-0001",
  "name": "Process Name",
  "version": "1.0.0",
  "tracking": {
    "organizationId": "CORP-2026",
    "departmentId": "DEPT-HR",
    "departmentName": "HR Team",
    "processType": "ONBOARDING",
    "priority": "high",
    "assignedTo": "USER-12345",
    "assignedToName": "John Doe",
    "dueDate": "2026-01-11T17:00:00Z",
    "estimatedHours": 8
  },
  "steps": [
    {
      "id": "step-1",
      "title": "Step Title",
      "description": "Step description",
      "checklist": [
        { "id": "check-1", "text": "Item", "required": true }
      ],
      "fields": [
        {
          "id": "field-1",
          "type": "text",
          "label": "Name",
          "required": true,
          "placeholder": "Enter name"
        }
      ]
    }
  ]
}
```

## Validation Rules

### Process Structure
1. Exactly 1 start node
2. At least 1 end node
3. All nodes (except start) have incoming connections
4. No circular references

### Tracking Config
1. Organization ID present
2. Department ID and name present
3. Assigned user ID and name present
4. Priority set
5. Due date set

## Adding New Features

### Adding a New Node Type

1. Create node component in `src/components/nodes/`:
```typescript
export function CustomNode({ data, selected }: NodeProps) {
  return (
    <div className={...}>
      <Handle type="target" position={Position.Top} />
      {/* Node content */}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
```

2. Register in ProcessBuilder:
```typescript
const nodeTypes = useMemo(
  () => ({
    start: StartNode,
    custom: CustomNode, // Add here
    // ...
  }),
  []
);
```

3. Add to NodePalette:
```typescript
const nodeTypes = [
  { type: 'custom', label: 'Custom', icon: Icon, color: 'bg-color' },
];
```

### Adding New Field Types

1. Update type definition:
```typescript
export interface ProcessField {
  type: 'text' | 'number' | 'file' | 'date' | 'textarea' | 'custom';
  // ...
}
```

2. Add button in NodeEditor:
```typescript
<button onClick={() => handleAddField('custom')}>
  Custom
</button>
```

3. Handle in User Executor accordingly.

## Performance Considerations

### React Flow Optimization
- Node types memoized with `useMemo`
- Handler callbacks use `useCallback`
- Only re-render affected components

### Zustand Optimization
- Selector pattern for component subscriptions
- Only update needed state slices

### Build Optimization
- Code splitting by route (if routes added)
- Tree shaking for unused code
- Minification in production

## Testing Strategy

### Manual Testing Checklist
- [ ] Add all 4 node types
- [ ] Connect nodes in sequence
- [ ] Edit node content
- [ ] Set tracking config
- [ ] Export JSON (validation pass)
- [ ] Export JSON (validation fail)
- [ ] Delete nodes
- [ ] Reset process

### Edge Cases
- Empty process (no nodes)
- Disconnected nodes
- Circular references
- Missing required fields
- Very large processes (100+ nodes)

## Browser Compatibility

Tested on:
- Chrome 120+
- Firefox 120+
- Safari 17+
- Edge 120+

React Flow requires modern browser with:
- CSS Grid
- Flexbox
- Pointer Events

## Future Improvements

### Short Term
- [ ] Undo/Redo functionality
- [ ] Keyboard shortcuts
- [ ] Copy/paste nodes
- [ ] Multi-select and bulk edit

### Medium Term
- [ ] Import JSON (reverse process)
- [ ] Process templates library
- [ ] Conditional logic builder
- [ ] Real-time collaboration

### Long Term
- [ ] Version control
- [ ] Process simulation
- [ ] Analytics dashboard
- [ ] API integration

## Troubleshooting

### Build Errors
```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Clear Vite cache
rm -rf node_modules/.vite
pnpm dev
```

### Type Errors
- Check import statements use `type` keyword for type-only imports
- Ensure all parameters have type annotations
- Run `tsc -b` to see all errors

### Runtime Errors
- Check browser console
- Verify React Flow version compatibility
- Check Zustand store updates

## Contributing

1. Follow existing code style
2. Use TypeScript strictly
3. Add types for all functions
4. Test manually before committing
5. Update documentation

## License

MIT License - See LICENSE file for details.
