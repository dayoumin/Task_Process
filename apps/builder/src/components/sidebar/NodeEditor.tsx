import { useState } from 'react';
import { useProcessStore } from '../../stores/process-store';
import { Plus, Trash2, Edit3, ChevronDown, CheckSquare, FileInput } from 'lucide-react';
import type { ChecklistItem, ProcessField } from '@task-process/shared-types';

export function NodeEditor() {
  const { selectedNode, updateNodeData } = useProcessStore();
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    checklist: true,
    fields: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  if (!selectedNode) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Edit3 size={40} className="text-gray-300 mx-auto mb-4" />
          <p className="text-sm text-gray-500 font-medium">노드를 선택하여 편집하세요</p>
          <p className="text-sm text-gray-400 mt-2">캔버스에서 노드를 클릭</p>
        </div>
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
    <div>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-700">선택한 노드</h3>
      </div>

      {/* Basic Info Section */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection('basic')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors group"
        >
          <span className="text-sm font-medium text-gray-700">기본 정보</span>
          <ChevronDown
            size={16}
            className={`text-gray-500 transition-transform ${expandedSections.basic ? 'rotate-180' : ''}`}
          />
        </button>

        {expandedSections.basic && (
          <div className="px-6 pb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">제목</label>
              <input
                type="text"
                value={data.label || ''}
                onChange={(e) => handleUpdateBasic('label', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="노드 제목"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">설명</label>
              <textarea
                value={data.description || ''}
                onChange={(e) => handleUpdateBasic('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="노드에 대한 설명을 입력하세요"
              />
            </div>
          </div>
        )}
      </div>

      {/* Checklist Section (Task nodes only) */}
      {isTaskNode && (
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection('checklist')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <CheckSquare size={16} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">체크리스트</span>
              {(data.checklist?.length || 0) > 0 && (
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
                  {data.checklist?.length}
                </span>
              )}
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-500 transition-transform ${expandedSections.checklist ? 'rotate-180' : ''}`}
            />
          </button>

          {expandedSections.checklist && (
            <div className="px-6 pb-6">
              <button
                onClick={handleAddChecklist}
                className="w-full px-4 py-3 mb-4 text-sm font-medium text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Plus size={16} />
                체크리스트 항목 추가
              </button>

              <div className="space-y-3">
                {(data.checklist || []).map((item: ChecklistItem, index: number) => (
                  <div key={item.id} className="p-3 border border-gray-200 rounded-lg bg-gray-50 space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) => handleUpdateChecklist(index, { text: e.target.value })}
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="체크리스트 항목"
                      />
                      <button
                        onClick={() => handleRemoveChecklist(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="삭제"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={item.required}
                        onChange={(e) => handleUpdateChecklist(index, { required: e.target.checked })}
                        className="rounded border-gray-300 w-4 h-4"
                      />
                      필수 항목
                    </label>
                  </div>
                ))}
                {(data.checklist?.length || 0) === 0 && (
                  <p className="text-sm text-gray-400 text-center py-6">체크리스트 항목이 없습니다</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Fields Section (Task nodes only) */}
      {isTaskNode && (
        <div>
          <button
            onClick={() => toggleSection('fields')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors group"
          >
            <div className="flex items-center gap-2">
              <FileInput size={16} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">입력 필드</span>
              {(data.fields?.length || 0) > 0 && (
                <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full font-medium">
                  {data.fields?.length}
                </span>
              )}
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-500 transition-transform ${expandedSections.fields ? 'rotate-180' : ''}`}
            />
          </button>

          {expandedSections.fields && (
            <div className="px-6 pb-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => handleAddField('text')}
                  className="px-3 py-2 text-sm bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                >
                  + 텍스트
                </button>
                <button
                  onClick={() => handleAddField('file')}
                  className="px-3 py-2 text-sm bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                >
                  + 파일
                </button>
                <button
                  onClick={() => handleAddField('date')}
                  className="px-3 py-2 text-sm bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                >
                  + 날짜
                </button>
                <button
                  onClick={() => handleAddField('textarea')}
                  className="px-3 py-2 text-sm bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                >
                  + 긴 텍스트
                </button>
              </div>

              <div className="space-y-3">
                {(data.fields || []).map((field: ProcessField, index: number) => (
                  <div key={field.id} className="p-3 border border-gray-200 rounded-lg bg-white space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500 uppercase">{field.type}</span>
                      <button
                        onClick={() => handleRemoveField(index)}
                        className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                        title="삭제"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => handleUpdateField(index, { label: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="필드 라벨"
                    />

                    <input
                      type="text"
                      value={field.placeholder || ''}
                      onChange={(e) => handleUpdateField(index, { placeholder: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="플레이스홀더"
                    />

                    <label className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => handleUpdateField(index, { required: e.target.checked })}
                        className="rounded border-gray-300 w-4 h-4"
                      />
                      필수 입력
                    </label>
                  </div>
                ))}
                {(data.fields?.length || 0) === 0 && (
                  <p className="text-sm text-gray-400 text-center py-6">입력 필드가 없습니다</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
