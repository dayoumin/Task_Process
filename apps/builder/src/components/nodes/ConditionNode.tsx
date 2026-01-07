import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { GitBranch, Trash2, Copy } from 'lucide-react';
import { useProcessStore } from '../../stores/process-store';

export const ConditionNode = memo(function ConditionNode({ id, data, selected }: NodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || '조건 분기');
  const inputRef = useRef<HTMLInputElement>(null);
  const { updateNodeData, removeNode, duplicateNode } = useProcessStore();

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
      setLabel(data.label || '조건 분기');
    }
  }, [id, label, data.label, updateNodeData]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setLabel(data.label || '조건 분기');
      setIsEditing(false);
    }
  }, [data.label, handleBlur]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('조건 노드를 삭제하시겠습니까?')) {
      removeNode(id);
    }
  }, [id, removeNode]);

  const handleDuplicate = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateNode(id);
  }, [id, duplicateNode]);

  return (
    <div
      className={`group relative px-4 py-3 rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-md border-2 min-w-[200px] transition-all duration-200 ${
        selected
          ? 'border-yellow-500 shadow-lg shadow-yellow-500/20 ring-2 ring-yellow-500/20'
          : 'border-yellow-300 hover:border-yellow-400 hover:shadow-lg'
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-yellow-600 border-2 border-white shadow-md"
      />

      {/* Mini Toolbar */}
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
        <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-yellow-200 flex items-center justify-center">
          <GitBranch size={18} className="text-yellow-700" />
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
              className="nodrag w-full font-semibold text-gray-900 bg-transparent border-b-2 border-yellow-500 outline-none px-0"
            />
          ) : (
            <div
              className="font-semibold text-gray-900 truncate cursor-text"
              onDoubleClick={handleDoubleClick}
              title="더블 클릭하여 편집"
            >
              {data.label || '조건 분기'}
            </div>
          )}

          {data.description && (
            <div className="text-xs text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
              {data.description}
            </div>
          )}
        </div>
      </div>

      {/* Branch Labels */}
      <div className="flex justify-between mt-3 px-1">
        <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded">참</span>
        <span className="text-xs font-medium text-red-700 bg-red-50 px-2 py-0.5 rounded">거짓</span>
      </div>

      <div className="flex justify-between mt-1">
        <Handle
          type="source"
          position={Position.Bottom}
          id="true"
          className="w-3 h-3 !bg-green-600 border-2 border-white shadow-md"
          style={{ left: '30%' }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="false"
          className="w-3 h-3 !bg-red-600 border-2 border-white shadow-md"
          style={{ left: '70%' }}
        />
      </div>
    </div>
  );
});
