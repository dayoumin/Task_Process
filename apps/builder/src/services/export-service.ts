import type { Node, Edge } from 'reactflow';
import type { ProcessData, ProcessStep, TrackingConfig } from '@task-process/shared-types';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export class ExportService {
  /**
   * Sanitize filename to prevent path traversal and injection attacks
   */
  private static sanitizeFilename(filename: string): string {
    // Remove path separators and special characters
    let sanitized = filename.replace(/[/\\?%*:|"<>]/g, '-');

    // Remove leading/trailing dots and spaces
    sanitized = sanitized.replace(/^[.\s]+|[.\s]+$/g, '');

    // Ensure it's not empty
    if (!sanitized) {
      sanitized = 'process';
    }

    // Limit length to 255 characters
    if (sanitized.length > 255) {
      sanitized = sanitized.substring(0, 255);
    }

    // Ensure .json extension
    if (!sanitized.endsWith('.json')) {
      sanitized += '.json';
    }

    return sanitized;
  }

  /**
   * Check if all end nodes are reachable from start node
   */
  private static checkEndNodeReachability(nodes: Node[], edges: Edge[]): string[] {
    const errors: string[] = [];
    const startNode = nodes.find((n) => n.type === 'start');
    if (!startNode) return errors;

    const endNodes = nodes.filter((n) => n.type === 'end');
    const reachableNodes = new Set<string>();

    // BFS to find all reachable nodes from start
    const queue: string[] = [startNode.id];
    reachableNodes.add(startNode.id);

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const outgoingEdges = edges.filter((e) => e.source === currentId);

      for (const edge of outgoingEdges) {
        if (!reachableNodes.has(edge.target)) {
          reachableNodes.add(edge.target);
          queue.push(edge.target);
        }
      }
    }

    // Check if all end nodes are reachable
    for (const endNode of endNodes) {
      if (!reachableNodes.has(endNode.id)) {
        errors.push(`종료 노드 '${endNode.data.label || endNode.id}'에 도달할 수 없습니다`);
      }
    }

    return errors;
  }

  /**
   * Validate process before export
   */
  static validateProcess(nodes: Node[], edges: Edge[]): ValidationResult {
    const errors: string[] = [];

    // 1. Check for start node
    const startNodes = nodes.filter((n) => n.type === 'start');
    if (startNodes.length === 0) {
      errors.push('시작 노드가 없습니다');
    } else if (startNodes.length > 1) {
      errors.push('시작 노드는 하나만 있어야 합니다');
    }

    // 2. Check for end node
    const endNodes = nodes.filter((n) => n.type === 'end');
    if (endNodes.length === 0) {
      errors.push('종료 노드가 없습니다');
    }

    // 3. Check connections (except start node)
    for (const node of nodes) {
      if (node.type === 'start') continue;
      const incomingEdges = edges.filter((e) => e.target === node.id);
      if (incomingEdges.length === 0) {
        errors.push(`${node.data.label || node.id} 노드가 연결되지 않았습니다`);
      }
    }

    // 4. Check for cycles
    if (this.hasCycle(nodes, edges)) {
      errors.push('순환 참조가 존재합니다');
    }

    // 5. Check end node reachability
    if (startNodes.length === 1 && endNodes.length > 0) {
      const reachabilityErrors = this.checkEndNodeReachability(nodes, edges);
      errors.push(...reachabilityErrors);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check for cycle in graph
   */
  private static hasCycle(nodes: Node[], edges: Edge[]): boolean {
    const visited = new Set<string>();
    const recStack = new Set<string>();

    const dfs = (nodeId: string): boolean => {
      visited.add(nodeId);
      recStack.add(nodeId);

      const outgoingEdges = edges.filter((e) => e.source === nodeId);
      for (const edge of outgoingEdges) {
        if (!visited.has(edge.target)) {
          if (dfs(edge.target)) return true;
        } else if (recStack.has(edge.target)) {
          return true;
        }
      }

      recStack.delete(nodeId);
      return false;
    };

    for (const node of nodes) {
      if (!visited.has(node.id)) {
        if (dfs(node.id)) return true;
      }
    }

    return false;
  }

  /**
   * Generate JSON from nodes and edges
   */
  static generateJSON(
    nodes: Node[],
    edges: Edge[],
    processName: string,
    tracking: TrackingConfig,
    processId?: string
  ): ProcessData {
    // Create Map for O(1) node lookup
    const nodeMap = new Map(nodes.map((node) => [node.id, node]));

    // Find start node
    const startNode = nodes.find((n) => n.type === 'start');
    if (!startNode) {
      throw new Error('시작 노드가 없습니다');
    }

    const steps: ProcessStep[] = [];
    let currentNodeId = startNode.id;
    const visited = new Set<string>();
    let stepCounter = 1;

    while (currentNodeId) {
      if (visited.has(currentNodeId)) break;
      visited.add(currentNodeId);

      const node = nodeMap.get(currentNodeId);
      if (!node) break;

      // Skip start node, but add task/end nodes
      if (node.type === 'task' || node.type === 'end') {
        steps.push({
          id: `step-${stepCounter++}`,
          title: node.data.label || node.data.title || '제목 없음',
          description: node.data.description || '',
          checklist: node.data.checklist || [],
          fields: node.data.fields || [],
        });
      }

      // Find next node
      const nextEdge = edges.find((e) => e.source === currentNodeId);
      currentNodeId = nextEdge?.target || '';
    }

    return {
      id: processId || `PROC-${Date.now()}`,
      name: processName,
      version: '1.0.0',
      tracking,
      steps,
    };
  }

  /**
   * Download JSON file
   */
  static downloadFile(data: ProcessData, filename: string): void {
    const sanitizedFilename = this.sanitizeFilename(filename);
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = sanitizedFilename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
