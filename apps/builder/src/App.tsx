import { ReactFlowProvider } from 'reactflow';
import { ProcessBuilder } from './components/ProcessBuilder';
import { NodePalette } from './components/sidebar/NodePalette';
import { NodeEditor } from './components/sidebar/NodeEditor';
import { TrackingSettings } from './components/sidebar/TrackingSettings';
import { ExportButton } from './components/export/ExportButton';
import { useProcessStore } from './stores/process-store';

function App() {
  const { processName, setProcessName, reset } = useProcessStore();

  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">프로세스 빌더</h1>
              <input
                type="text"
                value={processName}
                onChange={(e) => setProcessName(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="프로세스 이름"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={reset}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                초기화
              </button>
              <ExportButton />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Controls */}
          <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
            <NodePalette />
            <TrackingSettings />
            <NodeEditor />
          </aside>

          {/* Canvas */}
          <main className="flex-1">
            <ProcessBuilder />
          </main>
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default App;
