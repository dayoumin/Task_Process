import { useState, useEffect, memo, useCallback } from 'react';
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

export const ProcessList = memo(function ProcessList({
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

  // Close dropdown menu when clicking outside
  useEffect(() => {
    if (!menuOpenId) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Check if click is outside the dropdown menu
      if (!target.closest('[data-dropdown-menu]')) {
        setMenuOpenId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpenId]);

  // Memoized event handlers for better performance
  const handleDuplicate = useCallback((id: string) => {
    onDuplicateProcess(id);
    setMenuOpenId(null);
  }, [onDuplicateProcess]);

  const handleDelete = useCallback((id: string, name: string) => {
    if (window.confirm(`Delete "${name}"?`)) {
      onDeleteProcess(id);
    }
    setMenuOpenId(null);
  }, [onDeleteProcess]);

  const handleToggleMenu = useCallback((id: string) => {
    setMenuOpenId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="h-14 px-6 border-b border-gray-200 bg-white flex items-center justify-between">
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Processes</h2>
        <button
          onClick={onCreateProcess}
          className="w-8 h-8 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors"
          aria-label="Create new process"
          title="New Process"
        >
          <Plus size={16} />
        </button>
      </div>

      {/* Process List */}
      <div className="flex-1 overflow-y-auto bg-white">
        {processes.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <FileText size={32} className="mx-auto text-gray-300 mb-4" strokeWidth={1.5} />
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-4">No Processes</p>
            <button
              onClick={onCreateProcess}
              className="h-10 px-6 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              Create First Process
            </button>
          </div>
        ) : (
          <div className="p-3 space-y-1">
            {processes.map((process) => (
              <div
                key={process.id}
                className={`
                  group relative transition-all cursor-pointer border
                  ${activeProcessId === process.id
                    ? 'bg-gray-900 text-white border-gray-900'
                    : 'bg-white hover:bg-gray-50 border-gray-200 hover:border-gray-300'
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
                    className={`flex-shrink-0 ${
                      activeProcessId === process.id ? 'text-gray-300' : 'text-gray-400'
                    } hover:text-gray-600`}
                    aria-label={process.isExpanded ? 'Collapse process details' : 'Expand process details'}
                    aria-expanded={process.isExpanded}
                  >
                    {process.isExpanded ? (
                      <ChevronDown size={14} />
                    ) : (
                      <ChevronRight size={14} />
                    )}
                  </button>

                  {/* Process Icon */}
                  <FileText
                    size={14}
                    strokeWidth={2}
                    className={`flex-shrink-0 ${
                      activeProcessId === process.id ? 'text-white' : 'text-gray-500'
                    }`}
                  />

                  {/* Process Info */}
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate`}>
                      {process.name}
                    </div>
                    {process.isExpanded && (
                      <div className={`text-xs mt-1 ${
                        activeProcessId === process.id ? 'text-gray-300' : 'text-gray-500'
                      }`}>
                        {process.processType} · {process.updatedAt}
                      </div>
                    )}
                  </div>

                  {/* Action Menu */}
                  {(hoveredId === process.id || menuOpenId === process.id) && (
                    <div className="flex-shrink-0" data-dropdown-menu>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleMenu(process.id);
                        }}
                        className={`w-7 h-7 flex items-center justify-center ${
                          activeProcessId === process.id
                            ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                            : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                        }`}
                        aria-label="Process actions menu"
                        aria-expanded={menuOpenId === process.id}
                        aria-haspopup="menu"
                      >
                        <MoreVertical size={14} />
                      </button>

                      {/* Dropdown Menu */}
                      {menuOpenId === process.id && (
                        <div
                          className="absolute right-2 top-full mt-1 z-50 bg-white shadow-lg border border-gray-200 py-1 min-w-[140px]"
                          role="menu"
                          aria-label="Process actions"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicate(process.id);
                            }}
                            className="w-full px-3 py-2 text-left text-xs text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            role="menuitem"
                          >
                            <Copy size={12} />
                            Duplicate
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(process.id, process.name);
                            }}
                            className="w-full px-3 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                            role="menuitem"
                          >
                            <Trash2 size={12} />
                            Delete
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
});
