import { useProcessStore } from '../../stores/process-store';
import { Plus, X, Trash2 } from 'lucide-react';
import type { ChecklistItem, ProcessField } from '@task-process/shared-types';

export function NodeEditor() {
  const { selectedNode, updateNodeData } = useProcessStore();

  if (!selectedNode) {
    return (
      <div className="bg-white border-b border-gray-200 p-4">
        <p className="text-sm text-gray-500">노드를 선택하여 편집하세요</p>
      </div>
    );
  }

  const { data } = selectedNode;

  const handleUpdateBasic = (key: string, value: string) => {
    updateNodeData(selectedNode.id, { [key]: value });
  };

  const handleAddChecklist = () => {
    const newItem: ChecklistItem = {
      id: `check-${Date.now()}`,
      text: '새 체크리스트 항목',
      checked: false,
      required: true,
    };
    updateNodeData(selectedNode.id, {
      checklist: [...(data.checklist || []), newItem],
    });
  };

  const handleUpdateChecklist = (index: number, updates: Partial<ChecklistItem>) => {
    const newChecklist = [...(data.checklist || [])];
    newChecklist[index] = { ...newChecklist[index], ...updates };
    updateNodeData(selectedNode.id, { checklist: newChecklist });
  };

  const handleRemoveChecklist = (index: number) => {
    const newChecklist = (data.checklist || []).filter((_item: ChecklistItem, i: number) => i !== index);
    updateNodeData(selectedNode.id, { checklist: newChecklist });
  };

  const handleAddField = (type: ProcessField['type']) => {
    const newField: ProcessField = {
      id: `field-${Date.now()}`,
      type,
      label: '새 필드',
      required: true,
      placeholder: '',
    };
    updateNodeData(selectedNode.id, {
      fields: [...(data.fields || []), newField],
    });
  };

  const handleUpdateField = (index: number, updates: Partial<ProcessField>) => {
    const newFields = [...(data.fields || [])];
    newFields[index] = { ...newFields[index], ...updates };
    updateNodeData(selectedNode.id, { fields: newFields });
  };

  const handleRemoveField = (index: number) => {
    const newFields = (data.fields || []).filter((_field: ProcessField, i: number) => i !== index);
    updateNodeData(selectedNode.id, { fields: newFields });
  };

  const isTaskNode = selectedNode.type === 'task';

  return (
    <div className="bg-white border-b border-gray-200 p-4 max-h-[600px] overflow-y-auto">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">노드 편집</h3>

      {/* Basic Info */}
      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">제목</label>
          <input
            type="text"
            value={data.label || ''}
            onChange={(e) => handleUpdateBasic('label', e.target.value)}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">설명</label>
          <textarea
            value={data.description || ''}
            onChange={(e) => handleUpdateBasic('description', e.target.value)}
            rows={2}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Checklist (Task nodes only) */}
      {isTaskNode && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-gray-700">체크리스트</label>
            <button
              onClick={handleAddChecklist}
              className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <Plus size={12} />
              추가
            </button>
          </div>

          <div className="space-y-2">
            {(data.checklist || []).map((item: ChecklistItem, index: number) => (
              <div key={item.id} className="flex gap-2 items-start">
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => handleUpdateChecklist(index, { text: e.target.value })}
                  className="flex-1 px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="체크리스트 항목"
                />
                <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={item.required}
                    onChange={(e) => handleUpdateChecklist(index, { required: e.target.checked })}
                  />
                  필수
                </label>
                <button
                  onClick={() => handleRemoveChecklist(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fields (Task nodes only) */}
      {isTaskNode && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-gray-700">입력 필드</label>
            <div className="flex gap-1">
              <button
                onClick={() => handleAddField('text')}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
              >
                텍스트
              </button>
              <button
                onClick={() => handleAddField('file')}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
              >
                파일
              </button>
              <button
                onClick={() => handleAddField('date')}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
              >
                날짜
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {(data.fields || []).map((field: ProcessField, index: number) => (
              <div key={field.id} className="border border-gray-200 rounded p-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500">{field.type}</span>
                  <button
                    onClick={() => handleRemoveField(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>

                <input
                  type="text"
                  value={field.label}
                  onChange={(e) => handleUpdateField(index, { label: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="필드 라벨"
                />

                <input
                  type="text"
                  value={field.placeholder || ''}
                  onChange={(e) => handleUpdateField(index, { placeholder: e.target.value })}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="플레이스홀더"
                />

                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => handleUpdateField(index, { required: e.target.checked })}
                  />
                  필수 입력
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
