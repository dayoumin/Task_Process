import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import type { Node, Edge, Connection, NodeChange, EdgeChange } from 'reactflow';
import type { TrackingConfig, ChecklistItem, ProcessField } from '@task-process/shared-types';
import { TrackingService } from '../services/tracking-service';

export interface NodeData {
  label?: string;
  title?: string;
  description?: string;
  checklist?: ChecklistItem[];
  fields?: ProcessField[];
}

export interface ProcessData {
  id: string;
  name: string;
  processId: string;
  tracking: TrackingConfig;
  nodes: Node[];
  edges: Edge[];
  createdAt: string;
  updatedAt: string;
  isExpanded: boolean;
}

interface MultiProcessStore {
  // Multiple processes
  processes: ProcessData[];
  activeProcessId: string | null;

  // Currently selected node
  selectedNode: Node | null;

  // Process management
  createProcess: () => void;
  duplicateProcess: (id: string) => void;
  deleteProcess: (id: string) => void;
  selectProcess: (id: string) => void;
  toggleProcessExpand: (id: string) => void;
  updateProcessName: (id: string, name: string) => void;
  updateProcessTracking: (id: string, updates: Partial<TrackingConfig>) => void;

  // Node management (operates on active process)
  addNode: (type: string, position: { x: number; y: number }) => void;
  removeNode: (id: string) => void;
  duplicateNode: (id: string) => void;
  updateNodeData: (id: string, data: Partial<NodeData>) => void;
  selectNode: (node: Node | null) => void;
  onNodesChange: (changes: NodeChange[]) => void;

  // Edge management
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;

  // Utility
  getActiveProcess: () => ProcessData | null;
  resetActiveProcess: () => void;
}

const createInitialTracking = (): TrackingConfig => ({
  organizationId: TrackingService.generateOrganizationId(),
  departmentId: 'DEPT-FIN',
  departmentName: '재무팀',
  processType: 'BUDGET_EXECUTION',
  priority: 'medium',
  assignedTo: '',
  assignedToName: '',
  dueDate: '',
  estimatedHours: 1,
});

const createNewProcess = (): ProcessData => {
  const now = new Date().toISOString();
  return {
    id: `process-${Date.now()}`,
    name: '새 프로세스',
    processId: TrackingService.generateProcessId(),
    tracking: createInitialTracking(),
    nodes: [],
    edges: [],
    createdAt: now,
    updatedAt: now,
    isExpanded: true,
  };
};

export const useMultiProcessStore = create<MultiProcessStore>()(
  persist(
    (set, get) => ({
      processes: [createNewProcess()],
      activeProcessId: null,
      selectedNode: null,

      createProcess: () => {
        const newProcess = createNewProcess();
        set({
          processes: [...get().processes, newProcess],
          activeProcessId: newProcess.id,
          selectedNode: null,
        });
      },

      duplicateProcess: (id) => {
        const process = get().processes.find((p) => p.id === id);
        if (!process) return;

        const duplicated: ProcessData = {
          ...JSON.parse(JSON.stringify(process)), // Deep copy
          id: `process-${Date.now()}`,
          name: `${process.name} (복사본)`,
          processId: TrackingService.generateProcessId(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set({
          processes: [...get().processes, duplicated],
          activeProcessId: duplicated.id,
        });
      },

      deleteProcess: (id) => {
        const processes = get().processes.filter((p) => p.id !== id);
        const activeProcessId = get().activeProcessId === id ? (processes[0]?.id || null) : get().activeProcessId;

        set({
          processes: processes.length > 0 ? processes : [createNewProcess()],
          activeProcessId,
          selectedNode: null,
        });
      },

      selectProcess: (id) => {
        set({ activeProcessId: id, selectedNode: null });
      },

      toggleProcessExpand: (id) => {
        set({
          processes: get().processes.map((p) =>
            p.id === id ? { ...p, isExpanded: !p.isExpanded } : p
          ),
        });
      },

      updateProcessName: (id, name) => {
        set({
          processes: get().processes.map((p) =>
            p.id === id ? { ...p, name, updatedAt: new Date().toISOString() } : p
          ),
        });
      },

      updateProcessTracking: (id, updates) => {
        set({
          processes: get().processes.map((p) =>
            p.id === id
              ? {
                  ...p,
                  tracking: { ...p.tracking, ...updates },
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        });
      },

      addNode: (type, position) => {
        const activeProcess = get().getActiveProcess();
        if (!activeProcess) return;

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

        set({
          processes: get().processes.map((p) =>
            p.id === activeProcess.id
              ? { ...p, nodes: [...p.nodes, newNode], updatedAt: new Date().toISOString() }
              : p
          ),
        });
      },

      removeNode: (id) => {
        const activeProcess = get().getActiveProcess();
        if (!activeProcess) return;

        set({
          processes: get().processes.map((p) =>
            p.id === activeProcess.id
              ? {
                  ...p,
                  nodes: p.nodes.filter((n) => n.id !== id),
                  edges: p.edges.filter((e) => e.source !== id && e.target !== id),
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
          selectedNode: get().selectedNode?.id === id ? null : get().selectedNode,
        });
      },

      duplicateNode: (id) => {
        const activeProcess = get().getActiveProcess();
        if (!activeProcess) return;

        const node = activeProcess.nodes.find((n) => n.id === id);
        if (!node) return;

        const newNode: Node = {
          ...node,
          id: `${node.type}-${Date.now()}`,
          position: {
            x: node.position.x + 50,
            y: node.position.y + 50,
          },
          data: JSON.parse(JSON.stringify(node.data)),
          selected: false,
        };

        set({
          processes: get().processes.map((p) =>
            p.id === activeProcess.id
              ? { ...p, nodes: [...p.nodes, newNode], updatedAt: new Date().toISOString() }
              : p
          ),
        });
      },

      updateNodeData: (id, data) => {
        const activeProcess = get().getActiveProcess();
        if (!activeProcess) return;

        set({
          processes: get().processes.map((p) =>
            p.id === activeProcess.id
              ? {
                  ...p,
                  nodes: p.nodes.map((node) =>
                    node.id === id ? { ...node, data: { ...node.data, ...data } } : node
                  ),
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        });
      },

      selectNode: (node) => set({ selectedNode: node }),

      onNodesChange: (changes) => {
        const activeProcess = get().getActiveProcess();
        if (!activeProcess) return;

        set({
          processes: get().processes.map((p) =>
            p.id === activeProcess.id
              ? {
                  ...p,
                  nodes: applyNodeChanges(changes, p.nodes),
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        });
      },

      onEdgesChange: (changes) => {
        const activeProcess = get().getActiveProcess();
        if (!activeProcess) return;

        set({
          processes: get().processes.map((p) =>
            p.id === activeProcess.id
              ? {
                  ...p,
                  edges: applyEdgeChanges(changes, p.edges),
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        });
      },

      onConnect: (connection) => {
        const activeProcess = get().getActiveProcess();
        if (!activeProcess) return;

        set({
          processes: get().processes.map((p) =>
            p.id === activeProcess.id
              ? {
                  ...p,
                  edges: addEdge(connection, p.edges),
                  updatedAt: new Date().toISOString(),
                }
              : p
          ),
        });
      },

      getActiveProcess: () => {
        const { processes, activeProcessId } = get();

        // If no active process is set, set the first one
        if (!activeProcessId && processes.length > 0) {
          set({ activeProcessId: processes[0].id });
          return processes[0];
        }

        return processes.find((p) => p.id === activeProcessId) || null;
      },

      resetActiveProcess: () => {
        const activeProcess = get().getActiveProcess();
        if (!activeProcess) return;

        if (window.confirm(`"${activeProcess.name}" 프로세스를 초기화하시겠습니까?`)) {
          set({
            processes: get().processes.map((p) =>
              p.id === activeProcess.id
                ? {
                    ...p,
                    nodes: [],
                    edges: [],
                    updatedAt: new Date().toISOString(),
                  }
                : p
            ),
            selectedNode: null,
          });
        }
      },
    }),
    {
      name: 'process-builder-storage',
      partialize: (state) => ({
        processes: state.processes,
        activeProcessId: state.activeProcessId,
      }),
    }
  )
);
