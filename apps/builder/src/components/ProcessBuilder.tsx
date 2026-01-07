import { useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  Panel,
  type NodeMouseHandler,
} from 'reactflow';

import { useMultiProcessStore } from '../stores/multi-process-store';
import { StartNode } from './nodes/StartNode';
import { EndNode } from './nodes/EndNode';
import { TaskNode } from './nodes/TaskNode';
import { ConditionNode } from './nodes/ConditionNode';

export function ProcessBuilder() {
  const {
    getActiveProcess,
    onNodesChange,
    onEdgesChange,
    onConnect,
    selectNode,
  } = useMultiProcessStore();

  const activeProcess = getActiveProcess();
  const nodes = activeProcess?.nodes || [];
  const edges = activeProcess?.edges || [];

  const nodeTypes = useMemo(
    () => ({
      start: StartNode,
      end: EndNode,
      task: TaskNode,
      condition: ConditionNode,
    }),
    []
  );

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_, node) => {
      selectNode(node);
    },
    [selectNode]
  );

  const handlePaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  return (
    <div className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={handleNodeClick}
        onPaneClick={handlePaneClick}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
        deleteKeyCode="Delete"
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case 'start':
                return '#22c55e';
              case 'end':
                return '#ef4444';
              case 'task':
                return '#3b82f6';
              case 'condition':
                return '#eab308';
              default:
                return '#9ca3af';
            }
          }}
          maskColor="rgba(0, 0, 0, 0.1)"
        />
        <Panel position="top-left" className="bg-white rounded-lg shadow-lg p-2">
          <div className="text-xs text-gray-600">
            노드 {nodes.length}개 | 연결 {edges.length}개
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
