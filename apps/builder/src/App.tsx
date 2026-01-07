import { useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { Settings, RotateCcw } from 'lucide-react';
import { ProcessBuilder } from './components/ProcessBuilder';
import { ProcessList } from './components/sidebar/ProcessList';
import { NodePalette } from './components/sidebar/NodePalette';
import { NodeEditor } from './components/sidebar/NodeEditor';
import { SettingsModal } from './components/settings/SettingsModal';
import { ExportButton } from './components/export/ExportButton';
import { useMultiProcessStore } from './stores/multi-process-store';

function App() {
  const {
    processes,
    activeProcessId,
    createProcess,
    duplicateProcess,
    deleteProcess,
    selectProcess,
    toggleProcessExpand,
    updateProcessName,
    resetActiveProcess,
    getActiveProcess,
  } = useMultiProcessStore();

  const [showSettings, setShowSettings] = useState(false);
  const activeProcess = getActiveProcess();

  return (
    <ReactFlowProvider>
      <div className="flex h-screen bg-gray-50">
        {/* Left Panel - Process List */}
        <aside className="w-72 bg-white border-r border-gray-200 flex-shrink-0">
          <ProcessList
            processes={processes.map((p) => ({
              id: p.id,
              name: p.name,
              processType: p.tracking.processType,
              updatedAt: new Date(p.updatedAt).toLocaleDateString('ko-KR'),
              isExpanded: p.isExpanded,
            }))}
            activeProcessId={activeProcessId || ''}
            onSelectProcess={selectProcess}
            onCreateProcess={createProcess}
            onDuplicateProcess={duplicateProcess}
            onDeleteProcess={deleteProcess}
            onToggleExpand={toggleProcessExpand}
          />
        </aside>

        {/* Center Panel - Canvas Area */}
        <div className="flex flex-col flex-1">
          {/* Top Bar */}
          <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6 flex-shrink-0">
            <div className="flex items-center gap-3 flex-1">
              <h1 className="text-sm font-medium text-gray-900 uppercase tracking-wide">Process Builder</h1>
              {activeProcess && (
                <>
                  <div className="h-4 w-px bg-gray-300"></div>
                  <input
                    type="text"
                    value={activeProcess.name}
                    onChange={(e) => updateProcessName(activeProcess.id, e.target.value)}
                    className="px-3 py-1.5 text-sm text-gray-900 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-gray-900 focus:outline-none transition-colors"
                    placeholder="Untitled Process"
                    aria-label="프로세스 이름"
                  />
                </>
              )}
            </div>
          </header>

          {/* Canvas */}
          <main className="flex-1 bg-gray-50">
            <ProcessBuilder />
          </main>
        </div>

        {/* Right Panel - Tools & Editor */}
        <aside className="w-80 bg-white border-l border-gray-200 flex flex-col flex-shrink-0">
          {/* Tools Header */}
          <div className="h-14 border-b border-gray-200 flex items-center px-6">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Tools</h2>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <NodePalette />
            <NodeEditor />
          </div>

          {/* Footer Actions */}
          <div className="border-t border-gray-200 p-6 space-y-3">
            <button
              onClick={() => setShowSettings(true)}
              className="w-full h-10 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-2"
              title="프로세스 설정"
            >
              <Settings size={16} />
              Settings
            </button>
            <div className="flex gap-3">
              <button
                onClick={resetActiveProcess}
                className="flex-1 h-10 text-sm font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-2"
                aria-label="현재 프로세스 초기화"
                title="현재 프로세스 초기화"
              >
                <RotateCcw size={14} />
                Reset
              </button>
              <div className="flex-1">
                <ExportButton />
              </div>
            </div>
          </div>
        </aside>

        {/* Settings Modal */}
        <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      </div>
    </ReactFlowProvider>
  );
}

export default App;
