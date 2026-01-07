import { memo, useState, useCallback, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import { PlayCircle, Trash2, Copy } from 'lucide-react';
import { useMultiProcessStore } from '../../stores/multi-process-store';

export const StartNode = memo(function StartNode({ id, data, selected }: NodeProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || '시작');
  const inputRef = useRef<HTMLInputElement>(null);
  const { updateNodeData, removeNode, duplicateNode } = useMultiProcessStore();

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
      setLabel(data.label || '시작');
    }
  }, [id, label, data.label, updateNodeData]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    } else if (e.key === 'Escape') {
      setLabel(data.label || '시작');
      setIsEditing(false);
    }
  }, [data.label, handleBlur]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('시작 노드를 삭제하시겠습니까?')) {
      removeNode(id);
    }
  }, [id, removeNode]);

  const handleDuplicate = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    duplicateNode(id);
  }, [id, duplicateNode]);

  return (
    <div
      className={`group relative px-6 py-4 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-md border-2 transition-all duration-200 min-w-[160px] ${
        selected
          ? 'border-white shadow-lg shadow-green-500/30 ring-2 ring-white/30'
          : 'border-green-600 hover:border-green-400 hover:shadow-lg'
      }`}
    >
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

      <div className="flex items-center gap-2.5">
        <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <PlayCircle size={20} className="text-white" />
        </div>
        <div className="flex-1">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              className="nodrag w-full font-semibold text-white bg-white/20 border-b-2 border-white outline-none px-1"
            />
          ) : (
            <div
              className="font-semibold cursor-text"
              onDoubleClick={handleDoubleClick}
              title="더블 클릭하여 편집"
            >
              {data.label || '시작'}
            </div>
          )}
        </div>
      </div>

      {data.description && (
        <div className="text-xs mt-2 opacity-90 leading-relaxed">{data.description}</div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-green-700 border-2 border-white shadow-md"
      />
    </div>
  );
});
