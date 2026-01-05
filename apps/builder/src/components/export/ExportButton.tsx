import { useState } from 'react';
import { Download } from 'lucide-react';
import { useProcessStore } from '../../stores/process-store';
import { ExportService } from '../../services/export-service';
import { TrackingService } from '../../services/tracking-service';

export function ExportButton() {
  const { nodes, edges, processName, processId, tracking } = useProcessStore();
  const [showError, setShowError] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleExport = () => {
    // Validate process
    const validation = ExportService.validateProcess(nodes, edges);
    if (!validation.valid) {
      setErrors(validation.errors);
      setShowError(true);
      return;
    }

    // Validate tracking
    const trackingValidation = TrackingService.validateTracking(tracking);
    if (!trackingValidation.valid) {
      setErrors(trackingValidation.errors);
      setShowError(true);
      return;
    }

    // Generate and download JSON
    try {
      const data = ExportService.generateJSON(nodes, edges, processName, tracking, processId);
      const filename = `${processName.replace(/\s+/g, '-')}.json`;
      ExportService.downloadFile(data, filename);

      setShowError(false);
      setErrors([]);
    } catch (error) {
      setErrors([error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다']);
      setShowError(true);
    }
  };

  return (
    <div>
      <button
        onClick={handleExport}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Download size={18} />
        JSON 내보내기
      </button>

      {showError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-red-600 mb-3">검증 오류</h3>
            <ul className="space-y-1 mb-4">
              {errors.map((error, index) => (
                <li key={index} className="text-sm text-gray-700">
                  • {error}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowError(false)}
              className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
