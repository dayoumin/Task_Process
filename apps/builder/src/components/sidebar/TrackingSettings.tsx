import { useMultiProcessStore } from '../../stores/multi-process-store';
import { DEPARTMENT_NAMES, PROCESS_TYPES } from '@task-process/shared-types';
import { TrackingService } from '../../services/tracking-service';

export function TrackingSettings() {
  const { getActiveProcess, updateProcessTracking } = useMultiProcessStore();
  const activeProcess = getActiveProcess();

  if (!activeProcess) return null;

  const tracking = activeProcess.tracking;

  const updateTracking = (updates: Partial<typeof tracking>) => {
    updateProcessTracking(activeProcess.id, updates);
  };

  const handleGenerateUserId = () => {
    const userId = TrackingService.generateUserId();
    updateTracking({ assignedTo: userId });
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">프로세스 정보</h3>

      <div className="space-y-3">
        {/* Department */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">부서</label>
          <select
            value={tracking.departmentId.replace('DEPT-', '')}
            onChange={(e) => {
              const code = e.target.value;
              updateTracking({
                departmentId: `DEPT-${code}`,
                departmentName: DEPARTMENT_NAMES[code],
              });
            }}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(DEPARTMENT_NAMES).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {/* Process Type - 드롭다운으로 변경 */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">업무 유형</label>
          <select
            value={tracking.processType}
            onChange={(e) => updateTracking({ processType: e.target.value })}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(PROCESS_TYPES).map(([code, label]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Process Creator ID */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">업무 생성자 ID</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={tracking.assignedTo}
              onChange={(e) => updateTracking({ assignedTo: e.target.value })}
              placeholder="USER-00001"
              className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleGenerateUserId}
              className="px-2 py-1.5 text-xs bg-gray-200 hover:bg-gray-300 rounded"
              title="ID 자동 생성"
            >
              생성
            </button>
          </div>
        </div>

        {/* Process Creator Name */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">업무 생성자 이름</label>
          <input
            type="text"
            value={tracking.assignedToName}
            onChange={(e) => updateTracking({ assignedToName: e.target.value })}
            placeholder="홍길동"
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
