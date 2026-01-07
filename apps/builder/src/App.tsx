import { useState } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { Settings } from 'lucide-react';
import { ProcessBuilder } from './components/ProcessBuilder';
import { NodePalette } from './components/sidebar/NodePalette';
import { NodeEditor } from './components/sidebar/NodeEditor';
import { SettingsModal } from './components/settings/SettingsModal';
import { ExportButton } from './components/export/ExportButton';
import { useProcessStore } from './stores/process-store';

function App() {
  const { processName, setProcessName, reset } = useProcessStore();
  const [showSettings, setShowSettings] = useState(false);

  const handleReset = () => {
    if (window.confirm('모든 작업이 삭제됩니다. 계속하시겠습니까?')) {
      reset();
    }
  };

  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 flex-shrink-0">
          <div className="px-6 py-3.5">
            <div className="flex items-center gap-4">
              <h1 className="text-base font-semibold text-gray-900">프로세스 빌더</h1>
              <div className="h-4 w-px bg-gray-300"></div>
              <input
                type="text"
                value={processName}
                onChange={(e) => setProcessName(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-64 bg-white"
                placeholder="새 프로세스"
                aria-label="프로세스 이름"
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <aside className="w-80 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
            {/* Sidebar Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">워크플로우 구성</h2>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto">
              <NodePalette />
              <NodeEditor />
            </div>

            {/* Sidebar Footer - Actions */}
            <div className="border-t border-gray-200 p-6 space-y-3">
              <button
                onClick={() => setShowSettings(true)}
                className="w-full px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-center gap-2"
                title="프로세스 설정"
              >
                <Settings size={16} />
                프로세스 설정
              </button>
              <div className="flex gap-3">
                <button
                  onClick={handleReset}
                  className="flex-1 px-4 py-3 text-sm font-medium text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
                  aria-label="모든 작업 초기화"
                >
                  초기화
                </button>
                <div className="flex-1">
                  <ExportButton />
                </div>
              </div>
            </div>
          </aside>

          {/* Canvas */}
          <main className="flex-1 bg-white overflow-hidden">
            <ProcessBuilder />
          </main>
        </div>

        {/* Settings Modal */}
        <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
      </div>
    </ReactFlowProvider>
  );
}

export default App;
