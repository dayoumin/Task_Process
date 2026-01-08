import { useState, memo } from 'react';
import { useMultiProcessStore } from '../../stores/multi-process-store';
import { Plus, Trash2, Edit3, ChevronDown, CheckSquare, FileInput } from 'lucide-react';
import type { ChecklistItem, ProcessField } from '@task-process/shared-types';

export const NodeEditor = memo(function NodeEditor() {
  const { selectedNode, updateNodeData } = useMultiProcessStore();
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
        <div className="text-center py-16">
          <Edit3 size={32} className="text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">No Selection</p>
          <p className="text-xs text-gray-400 mt-2">Click a node to edit</p>
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
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Node Properties</h3>
      </div>

      {/* Basic Info Section */}
      <div className="border-b border-gray-200">
        <button
          onClick={() => toggleSection('basic')}
          className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          aria-label="Toggle basic information section"
          aria-expanded={expandedSections.basic}
          aria-controls="basic-info-section"
        >
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Basic Info</span>
          <ChevronDown
            size={14}
            className={`text-gray-400 transition-transform ${expandedSections.basic ? 'rotate-180' : ''}`}
          />
        </button>

        {expandedSections.basic && (
          <div id="basic-info-section" className="px-6 pb-6 space-y-4" role="region" aria-label="Basic node information">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Label</label>
              <input
                type="text"
                value={data.label || ''}
                onChange={(e) => handleUpdateBasic('label', e.target.value)}
                className="w-full h-10 px-3 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:border-gray-900"
                placeholder="Node label"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Description</label>
              <textarea
                value={data.description || ''}
                onChange={(e) => handleUpdateBasic('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:border-gray-900 resize-none"
                placeholder="Node description"
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
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            aria-label="Toggle checklist section"
            aria-expanded={expandedSections.checklist}
            aria-controls="checklist-section"
          >
            <div className="flex items-center gap-2">
              <CheckSquare size={14} className="text-gray-500" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Checklist</span>
              {(data.checklist?.length || 0) > 0 && (
                <span className="text-xs px-1.5 py-0.5 bg-gray-200 text-gray-700 font-medium">
                  {data.checklist?.length}
                </span>
              )}
            </div>
            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform ${expandedSections.checklist ? 'rotate-180' : ''}`}
            />
          </button>

          {expandedSections.checklist && (
            <div id="checklist-section" className="px-6 pb-6" role="region" aria-label="Checklist items">
              <button
                onClick={handleAddChecklist}
                className="w-full h-10 mb-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={14} />
                Add Item
              </button>

              <div className="space-y-2">
                {(data.checklist || []).map((item: ChecklistItem, index: number) => (
                  <div key={item.id} className="p-3 border border-gray-200 bg-white space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={item.text}
                        onChange={(e) => handleUpdateChecklist(index, { text: e.target.value })}
                        className="flex-1 h-9 px-3 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:border-gray-900"
                        placeholder="Checklist item"
                      />
                      <button
                        onClick={() => handleRemoveChecklist(index)}
                        className="w-9 h-9 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <label className="flex items-center gap-2 text-xs text-gray-700">
                      <input
                        type="checkbox"
                        checked={item.required}
                        onChange={(e) => handleUpdateChecklist(index, { required: e.target.checked })}
                        className="border-gray-300 w-3.5 h-3.5"
                      />
                      Required
                    </label>
                  </div>
                ))}
                {(data.checklist?.length || 0) === 0 && (
                  <p className="text-xs text-gray-400 text-center py-8">No checklist items</p>
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
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            aria-label="Toggle input fields section"
            aria-expanded={expandedSections.fields}
            aria-controls="fields-section"
          >
            <div className="flex items-center gap-2">
              <FileInput size={14} className="text-gray-500" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Input Fields</span>
              {(data.fields?.length || 0) > 0 && (
                <span className="text-xs px-1.5 py-0.5 bg-gray-200 text-gray-700 font-medium">
                  {data.fields?.length}
                </span>
              )}
            </div>
            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform ${expandedSections.fields ? 'rotate-180' : ''}`}
            />
          </button>

          {expandedSections.fields && (
            <div id="fields-section" className="px-6 pb-6" role="region" aria-label="Input field definitions">
              <div className="grid grid-cols-2 gap-2 mb-4">
                <button
                  onClick={() => handleAddField('text')}
                  className="h-9 px-3 text-xs font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
                >
                  + Text
                </button>
                <button
                  onClick={() => handleAddField('file')}
                  className="h-9 px-3 text-xs font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
                >
                  + File
                </button>
                <button
                  onClick={() => handleAddField('date')}
                  className="h-9 px-3 text-xs font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
                >
                  + Date
                </button>
                <button
                  onClick={() => handleAddField('textarea')}
                  className="h-9 px-3 text-xs font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
                >
                  + Textarea
                </button>
              </div>

              <div className="space-y-2">
                {(data.fields || []).map((field: ProcessField, index: number) => (
                  <div key={field.id} className="p-3 border border-gray-200 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">{field.type}</span>
                      <button
                        onClick={() => handleRemoveField(index)}
                        className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={field.label}
                      onChange={(e) => handleUpdateField(index, { label: e.target.value })}
                      className="w-full h-9 px-3 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:border-gray-900"
                      placeholder="Field label"
                    />

                    <input
                      type="text"
                      value={field.placeholder || ''}
                      onChange={(e) => handleUpdateField(index, { placeholder: e.target.value })}
                      className="w-full h-9 px-3 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:border-gray-900"
                      placeholder="Placeholder text"
                    />

                    <label className="flex items-center gap-2 text-xs text-gray-700">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => handleUpdateField(index, { required: e.target.checked })}
                        className="border-gray-300 w-3.5 h-3.5"
                      />
                      Required
                    </label>
                  </div>
                ))}
                {(data.fields?.length || 0) === 0 && (
                  <p className="text-xs text-gray-400 text-center py-8">No input fields</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});
