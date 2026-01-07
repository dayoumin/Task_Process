import { create } from 'zustand';
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import type { Node, Edge, Connection, NodeChange, EdgeChange } from 'reactflow';
import type { TrackingConfig, ChecklistItem, ProcessField } from '@task-process/shared-types';
import { TrackingService } from '../services/tracking-service';

interface NodeData {
  label?: string;
  title?: string;
  description?: string;
  checklist?: ChecklistItem[];
  fields?: ProcessField[];
}

interface ProcessStore {
  // Process metadata
  processName: string;
  processId: string;

  // React Flow state
  nodes: Node[];
  edges: Edge[];
  selectedNode: Node | null;

  // Tracking configuration
  tracking: TrackingConfig;

  // Actions
  setProcessName: (name: string) => void;
  setProcessId: (id: string) => void;
  generateNewProcessId: () => void;

  // Node actions
  addNode: (type: string, position: { x: number; y: number }) => void;
  removeNode: (id: string) => void;
  duplicateNode: (id: string) => void;
  updateNodeData: (id: string, data: Partial<NodeData>) => void;
  selectNode: (node: Node | null) => void;
  onNodesChange: (changes: NodeChange[]) => void;

  // Edge actions
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // Tracking actions
  updateTracking: (updates: Partial<TrackingConfig>) => void;

  // Reset
  reset: () => void;
}

const initialTracking: TrackingConfig = {
  organizationId: TrackingService.generateOrganizationId(),
  departmentId: 'DEPT-FIN',
  departmentName: '재무팀',
  processType: 'BUDGET_EXECUTION',
  priority: 'medium',
  assignedTo: '',
  assignedToName: '',
  dueDate: '',
  estimatedHours: 1,
};

export const useProcessStore = create<ProcessStore>((set, get) => ({
  processName: '새 프로세스',
  processId: TrackingService.generateProcessId(),
  nodes: [],
  edges: [],
  selectedNode: null,
  tracking: initialTracking,

  setProcessName: (name) => set({ processName: name }),
  setProcessId: (id) => set({ processId: id }),
  generateNewProcessId: () => set({ processId: TrackingService.generateProcessId() }),

  addNode: (type, position) => {
    const newNode: Node = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: {
        label: type === 'start' ? '시작' : type === 'end' ? '완료' : type === 'task' ? '작업 단계' : '조건',
        description: '',
        checklist: [],
        fields: [],
      },
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  removeNode: (id) => {
    set({
      nodes: get().nodes.filter((n) => n.id !== id),
      edges: get().edges.filter((e) => e.source !== id && e.target !== id),
      selectedNode: get().selectedNode?.id === id ? null : get().selectedNode,
    });
  },

  duplicateNode: (id) => {
    const node = get().nodes.find((n) => n.id === id);
    if (!node) return;

    const newNode: Node = {
      ...node,
      id: `${node.type}-${Date.now()}`,
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50,
      },
      data: JSON.parse(JSON.stringify(node.data)), // Deep copy
      selected: false,
    };

    set({ nodes: [...get().nodes, newNode] });
  },

  updateNodeData: (id, data) => {
    try {
      set({
        nodes: get().nodes.map((node) =>
          node.id === id ? { ...node, data: { ...node.data, ...data } } : node
        ),
      });
    } catch (error) {
      console.error('Failed to update node data:', error);
      throw error;
    }
  },

  selectNode: (node) => set({ selectedNode: node }),

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  updateTracking: (updates) => {
    set({
      tracking: { ...get().tracking, ...updates },
    });
  },

  reset: () => {
    set({
      processName: '새 프로세스',
      processId: TrackingService.generateProcessId(),
      nodes: [],
      edges: [],
      selectedNode: null,
      tracking: initialTracking,
    });
  },
}));
