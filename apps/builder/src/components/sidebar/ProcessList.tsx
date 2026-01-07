import { useState } from 'react';
import { FileText, Plus, ChevronDown, ChevronRight, MoreVertical, Copy, Trash2 } from 'lucide-react';

interface Process {
  id: string;
  name: string;
  processType: string;
  updatedAt: string;
  isExpanded: boolean;
}

interface ProcessListProps {
  processes: Process[];
  activeProcessId: string;
  onSelectProcess: (id: string) => void;
  onCreateProcess: () => void;
  onDuplicateProcess: (id: string) => void;
  onDeleteProcess: (id: string) => void;
  onToggleExpand: (id: string) => void;
}

export function ProcessList({
  processes,
  activeProcessId,
  onSelectProcess,
  onCreateProcess,
  onDuplicateProcess,
  onDeleteProcess,
  onToggleExpand,
}: ProcessListProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-700">프로세스 목록</h2>
          <button
            onClick={onCreateProcess}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="새 프로세스 생성"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Process List */}
      <div className="flex-1 overflow-y-auto">
        {processes.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <FileText size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-sm text-gray-500 mb-3">프로세스가 없습니다</p>
            <button
              onClick={onCreateProcess}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              첫 프로세스 만들기
            </button>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {processes.map((process) => (
              <div
                key={process.id}
                className={`
                  group relative rounded-lg transition-all cursor-pointer
                  ${activeProcessId === process.id
                    ? 'bg-blue-50 border border-blue-200'
                    : 'hover:bg-white border border-transparent'
                  }
                `}
                onMouseEnter={() => setHoveredId(process.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div
                  className="flex items-center gap-2 px-3 py-2.5"
                  onClick={() => onSelectProcess(process.id)}
                >
                  {/* Expand/Collapse Icon */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleExpand(process.id);
                    }}
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                  >
                    {process.isExpanded ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>

                  {/* Process Icon */}
                  <FileText
                    size={16}
                    className={`flex-shrink-0 ${
                      activeProcessId === process.id ? 'text-blue-600' : 'text-gray-400'
                    }`}
                  />

                  {/* Process Info */}
                  <div className="flex-1 min-w-0">
                    <div
                      className={`text-sm font-medium truncate ${
                        activeProcessId === process.id ? 'text-blue-900' : 'text-gray-900'
                      }`}
                    >
                      {process.name}
                    </div>
                    {process.isExpanded && (
                      <div className="text-xs text-gray-500 mt-1">
                        {process.processType} · {process.updatedAt}
                      </div>
                    )}
                  </div>

                  {/* Action Menu */}
                  {(hoveredId === process.id || menuOpenId === process.id) && (
                    <div className="flex-shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuOpenId(menuOpenId === process.id ? null : process.id);
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                      >
                        <MoreVertical size={14} />
                      </button>

                      {/* Dropdown Menu */}
                      {menuOpenId === process.id && (
                        <div className="absolute right-2 top-full mt-1 z-10 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[140px]">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDuplicateProcess(process.id);
                              setMenuOpenId(null);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                          >
                            <Copy size={14} />
                            복제
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (
                                window.confirm(`"${process.name}" 프로세스를 삭제하시겠습니까?`)
                              ) {
                                onDeleteProcess(process.id);
                              }
                              setMenuOpenId(null);
                            }}
                            className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 size={14} />
                            삭제
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
