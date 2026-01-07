import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { FileText, CheckSquare, Edit2, Trash2, Copy } from 'lucide-react';
import { useMultiProcessStore } from '../../stores/multi-process-store';

export const TaskNode = memo(function TaskNode({ id, data, selected }: NodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || '작업 단계');
  const inputRef = useRef<HTMLInputElement>(null);
  const { updateNodeData, removeNode, duplicateNode } = useMultiProcessStore();

  const checklistCount = data.checklist?.length || 0;
  const fieldsCount = data.fields?.length || 0;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (label.trim()) {
      updateNodeData(id, { label: label.trim() });
    } else {
      setLabel(data.label || '작업 단계');
    }
  }, [id, label, data.label, updateNodeData]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setLabel(data.label || '작업 단계');
      setIsEditing(false);
    }
  }, [data.label, handleBlur]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('이 노드를 삭제하시겠습니까?')) {
      removeNode(id);
    }
  }, [id, removeNode]);

  const handleDuplicate = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateNode(id);
  }, [id, duplicateNode]);

  return (
    <div
      className={`group relative px-4 py-3 rounded-xl bg-white shadow-md border-2 min-w-[200px] transition-all duration-200 ${
        selected
          ? 'border-blue-500 shadow-lg shadow-blue-500/20 ring-2 ring-blue-500/20'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-lg'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-blue-500 border-2 border-white shadow-md"
      />

      {/* Mini Toolbar - Figma Style */}
      {selected && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-1 bg-white rounded-lg shadow-lg border border-gray-200 p-1">
          <button
            onClick={handleDuplicate}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
            title="복제"
          >
            <Copy size={14} className="text-gray-700" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 hover:bg-red-50 rounded transition-colors"
            title="삭제"
          >
            <Trash2 size={14} className="text-red-600" />
          </button>
        </div>
      )}

      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
          <FileText size={18} className="text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="nodrag w-full font-semibold text-gray-900 bg-transparent border-b-2 border-blue-500 outline-none px-0"
            />
          ) : (
            <div
              className="font-semibold text-gray-900 truncate cursor-text"
              onDoubleClick={handleDoubleClick}
              title="더블 클릭하여 편집"
            >
              {data.label || '작업 단계'}
            </div>
          )}

          {data.description && (
            <div className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
              {data.description}
            </div>
          )}

          {(checklistCount > 0 || fieldsCount > 0) && (
            <div className="flex gap-3 mt-2.5 text-xs text-gray-500">
              {checklistCount > 0 && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md">
                  <CheckSquare size={12} />
                  <span>{checklistCount}</span>
                </div>
              )}
              {fieldsCount > 0 && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-md">
                  <Edit2 size={12} />
                  <span>{fieldsCount}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-blue-500 border-2 border-white shadow-md"
      />
    </div>
  );
});
