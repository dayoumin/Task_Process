import { useState } from 'react';
import { PlayCircle, FileText, GitBranch, CheckCircle, ChevronDown, Plus } from 'lucide-react';
import { useProcessStore } from '../../stores/process-store';

const nodeTypes = [
  {
    type: 'start',
    label: '시작',
    icon: PlayCircle,
    color: 'from-green-500 to-green-600',
    borderColor: 'border-gray-200',
    bgColor: 'bg-white',
    textColor: 'text-gray-700',
    hoverColor: 'hover:bg-gray-50',
    iconBg: 'bg-green-50',
    iconBorder: 'border-green-200',
    iconColor: 'text-green-600'
  },
  {
    type: 'task',
    label: '작업',
    icon: FileText,
    color: 'from-blue-500 to-blue-600',
    borderColor: 'border-gray-200',
    bgColor: 'bg-white',
    textColor: 'text-gray-700',
    hoverColor: 'hover:bg-gray-50',
    iconBg: 'bg-blue-50',
    iconBorder: 'border-blue-200',
    iconColor: 'text-blue-600'
  },
  {
    type: 'condition',
    label: '조건',
    icon: GitBranch,
    color: 'from-yellow-500 to-yellow-600',
    borderColor: 'border-gray-200',
    bgColor: 'bg-white',
    textColor: 'text-gray-700',
    hoverColor: 'hover:bg-gray-50',
    iconBg: 'bg-amber-50',
    iconBorder: 'border-amber-200',
    iconColor: 'text-amber-600'
  },
  {
    type: 'end',
    label: '완료',
    icon: CheckCircle,
    color: 'from-red-500 to-red-600',
    borderColor: 'border-gray-200',
    bgColor: 'bg-white',
    textColor: 'text-gray-700',
    hoverColor: 'hover:bg-gray-50',
    iconBg: 'bg-red-50',
    iconBorder: 'border-red-200',
    iconColor: 'text-red-600'
  },
];

export function NodePalette() {
  const [isExpanded, setIsExpanded] = useState(true);
  const addNode = useProcessStore((state) => state.addNode);

  const handleAddNode = (type: string) => {
    // Add node at center of canvas for predictable positioning
    const position = {
      x: 250,
      y: 250,
    };
    addNode(type, position);
  };

  return (
    <div className="border-b border-gray-200">
      <div className="px-6 py-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between py-1"
        >
          <h3 className="text-sm font-medium text-gray-700">노드 추가</h3>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      {isExpanded && (
        <div className="px-6 pb-6 space-y-2">
          {nodeTypes.map(({ type, label, icon: Icon, bgColor, textColor, hoverColor, borderColor, iconBg, iconBorder, iconColor }) => (
            <button
              key={type}
              onClick={() => handleAddNode(type)}
              className={`w-full ${bgColor} ${textColor} ${hoverColor} border ${borderColor} px-4 py-3 rounded-lg transition-all flex items-center gap-3 text-sm font-medium group`}
            >
              <div className={`flex-shrink-0 w-8 h-8 ${iconBg} ${iconColor} rounded-md flex items-center justify-center border ${iconBorder}`}>
                <Icon size={16} />
              </div>
              <span className="flex-1 text-left">{label}</span>
              <Plus size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
