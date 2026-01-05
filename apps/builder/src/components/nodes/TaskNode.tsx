import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { FileText, CheckSquare, Edit2 } from 'lucide-react';

export const TaskNode = memo(function TaskNode({ data, selected }: NodeProps) {
  const checklistCount = data.checklist?.length || 0;
  const fieldsCount = data.fields?.length || 0;

  return (
    <div
      className={`px-4 py-3 rounded-lg bg-white shadow-lg border-2 min-w-[200px] ${
        selected ? 'border-blue-500' : 'border-gray-300'
      }`}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500" />

      <div className="flex items-start gap-2">
        <FileText size={18} className="text-blue-600 mt-1 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 truncate">{data.label || '작업 단계'}</div>
          {data.description && (
            <div className="text-xs text-gray-600 mt-1 line-clamp-2">{data.description}</div>
          )}

          <div className="flex gap-3 mt-2 text-xs text-gray-500">
            {checklistCount > 0 && (
              <div className="flex items-center gap-1">
                <CheckSquare size={12} />
                <span>{checklistCount}개 항목</span>
              </div>
            )}
            {fieldsCount > 0 && (
              <div className="flex items-center gap-1">
                <Edit2 size={12} />
                <span>{fieldsCount}개 필드</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500" />
    </div>
  );
});
