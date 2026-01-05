import { useProcessStore } from '../../stores/process-store';
import { DEPARTMENT_NAMES, PRIORITY_LABELS } from '@task-process/shared-types';
import type { Priority } from '@task-process/shared-types';
import { TrackingService } from '../../services/tracking-service';

export function TrackingSettings() {
  const { tracking, updateTracking } = useProcessStore();

  const handleGenerateUserId = () => {
    const userId = TrackingService.generateUserId();
    updateTracking({ assignedTo: userId });
  };

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">추적 관리 설정</h3>

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

        {/* Process Type */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">업무 유형</label>
          <input
            type="text"
            value={tracking.processType}
            onChange={(e) => updateTracking({ processType: e.target.value })}
            placeholder="예: ONBOARDING"
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Assigned To ID */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">담당자 ID</label>
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

        {/* Assigned To Name */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">담당자 이름</label>
          <input
            type="text"
            value={tracking.assignedToName}
            onChange={(e) => updateTracking({ assignedToName: e.target.value })}
            placeholder="홍길동"
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">우선순위</label>
          <select
            value={tracking.priority}
            onChange={(e) => updateTracking({ priority: e.target.value as Priority })}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">마감일</label>
          <input
            type="datetime-local"
            value={tracking.dueDate ? tracking.dueDate.slice(0, 16) : ''}
            onChange={(e) => {
              const isoDate = e.target.value ? new Date(e.target.value).toISOString() : '';
              updateTracking({ dueDate: isoDate });
            }}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Estimated Hours */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            예상 소요 시간 (시간)
          </label>
          <input
            type="number"
            min="1"
            value={tracking.estimatedHours}
            onChange={(e) => updateTracking({ estimatedHours: parseInt(e.target.value) || 1 })}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
