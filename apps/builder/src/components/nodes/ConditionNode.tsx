import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { GitBranch } from 'lucide-react';

export const ConditionNode = memo(function ConditionNode({ data, selected }: NodeProps) {
  return (
    <div
      className={`px-4 py-3 rounded-lg bg-yellow-50 shadow-lg border-2 min-w-[180px] ${
        selected ? 'border-blue-500' : 'border-yellow-400'
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-yellow-600" />

      <div className="flex items-start gap-2">
        <GitBranch size={18} className="text-yellow-700 mt-1 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 truncate">{data.label || '조건 분기'}</div>
          {data.description && (
            <div className="text-xs text-gray-600 mt-1 line-clamp-2">{data.description}</div>
          )}
        </div>
      </div>

      <div className="flex justify-between mt-2">
        <Handle
          type="source"
          position={Position.Bottom}
          id="true"
          className="w-3 h-3 bg-green-600"
          style={{ left: '30%' }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="false"
          className="w-3 h-3 bg-red-600"
          style={{ left: '70%' }}
        />
      </div>
    </div>
  );
});
