import { useState, memo } from 'react';
import { PlayCircle, FileText, GitBranch, CheckCircle, ChevronDown, Plus } from 'lucide-react';
import { useMultiProcessStore } from '../../stores/multi-process-store';

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

export const NodePalette = memo(function NodePalette() {
  const [isExpanded, setIsExpanded] = useState(true);
  const addNode = useMultiProcessStore((state) => state.addNode);

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
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
        aria-label="Toggle node palette"
        aria-expanded={isExpanded}
        aria-controls="node-palette-content"
      >
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Add Nodes</h3>
        <ChevronDown
          size={14}
          className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <div id="node-palette-content" className="px-6 pb-6 space-y-2" role="region" aria-label="Available node types">
          {nodeTypes.map(({ type, label, icon: Icon, iconColor }) => (
            <button
              key={type}
              onClick={() => handleAddNode(type)}
              className="w-full h-11 px-4 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center gap-3 group"
              aria-label={`Add ${label} node to canvas`}
            >
              <div className={`flex-shrink-0 w-5 h-5 ${iconColor} flex items-center justify-center`}>
                <Icon size={16} strokeWidth={2.5} />
              </div>
              <span className="flex-1 text-left">{label}</span>
              <Plus size={13} className="opacity-0 group-hover:opacity-60 transition-opacity text-gray-500" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
});
