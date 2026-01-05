import { PlayCircle, FileText, GitBranch, CheckCircle } from 'lucide-react';
import { useProcessStore } from '../../stores/process-store';

const nodeTypes = [
  { type: 'start', label: '시작', icon: PlayCircle, color: 'bg-green-500' },
  { type: 'task', label: '작업', icon: FileText, color: 'bg-blue-500' },
  { type: 'condition', label: '조건', icon: GitBranch, color: 'bg-yellow-500' },
  { type: 'end', label: '완료', icon: CheckCircle, color: 'bg-red-500' },
];

export function NodePalette() {
  const addNode = useProcessStore((state) => state.addNode);

  const handleAddNode = (type: string) => {
    // Add node at center of canvas
    const position = {
      x: Math.random() * 400 + 100,
      y: Math.random() * 400 + 100,
    };
    addNode(type, position);
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">노드 추가</h3>
      <div className="grid grid-cols-2 gap-2">
        {nodeTypes.map(({ type, label, icon: Icon, color }) => (
          <button
            key={type}
            onClick={() => handleAddNode(type)}
            className={`${color} text-white px-3 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 text-sm font-medium`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
