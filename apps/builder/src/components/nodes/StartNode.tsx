import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { PlayCircle } from 'lucide-react';

export const StartNode = memo(function StartNode({ data, selected }: NodeProps) {
  return (
    <div
      className={`px-6 py-4 rounded-lg bg-green-500 text-white shadow-lg border-2 ${
        selected ? 'border-blue-500' : 'border-green-600'
      }`}
    >
      <div className="flex items-center gap-2">
        <PlayCircle size={20} />
        <div className="font-semibold">{data.label || '시작'}</div>
      </div>
      {data.description && (
        <div className="text-xs mt-1 opacity-90">{data.description}</div>
      )}
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-green-700" />
    </div>
  );
});
