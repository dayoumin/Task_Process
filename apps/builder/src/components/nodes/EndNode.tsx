import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { CheckCircle } from 'lucide-react';

export const EndNode = memo(function EndNode({ data, selected }: NodeProps) {
  return (
    <div
      className={`px-6 py-4 rounded-lg bg-red-500 text-white shadow-lg border-2 ${
        selected ? 'border-blue-500' : 'border-red-600'
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-red-700" />
      <div className="flex items-center gap-2">
        <CheckCircle size={20} />
        <div className="font-semibold">{data.label || '완료'}</div>
      </div>
      {data.description && (
        <div className="text-xs mt-1 opacity-90">{data.description}</div>
      )}
    </div>
  );
});
