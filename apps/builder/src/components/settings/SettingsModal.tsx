import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useMultiProcessStore } from '../../stores/multi-process-store';
import { DEPARTMENT_NAMES, PROCESS_TYPES } from '@task-process/shared-types';
import { TrackingService } from '../../services/tracking-service';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { getActiveProcess, updateProcessTracking } = useMultiProcessStore();
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLSelectElement>(null);

  const activeProcess = getActiveProcess();
  const tracking = activeProcess?.tracking || {
    organizationId: '',
    departmentId: 'DEPT-IT',
    departmentName: 'IT팀',
    processType: 'GENERAL',
    priority: 'medium' as const,
    assignedTo: '',
    assignedToName: '',
    dueDate: '',
    estimatedHours: 1,
  };

  const updateTracking = (updates: Partial<typeof tracking>) => {
    if (activeProcess) {
      updateProcessTracking(activeProcess.id, updates);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    // Focus first input when modal opens
    firstInputRef.current?.focus();

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, select, input, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('keydown', handleTab);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleTab);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !activeProcess) return null;

  const handleGenerateUserId = () => {
    const userId = TrackingService.generateUserId();
    updateTracking({ assignedTo: userId });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-lg shadow-lg w-full max-w-lg max-h-[85vh] overflow-hidden border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 id="settings-title" className="text-base font-semibold text-gray-900">
            프로세스 설정
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label="설정 닫기"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-5 overflow-y-auto max-h-[calc(85vh-120px)]">
            <div className="space-y-4">
              {/* Department */}
              <div>
                <label htmlFor="department-select" className="block text-sm font-medium text-gray-700 mb-2">
                  부서
                </label>
                <select
                  id="department-select"
                  ref={firstInputRef}
                  value={tracking.departmentId.replace('DEPT-', '')}
                  onChange={(e) => {
                    const code = e.target.value;
                    updateTracking({
                      departmentId: `DEPT-${code}`,
                      departmentName: DEPARTMENT_NAMES[code],
                    });
                  }}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
              <label htmlFor="process-type-select" className="block text-sm font-medium text-gray-700 mb-2">
                업무 유형
              </label>
              <select
                id="process-type-select"
                value={tracking.processType}
                onChange={(e) => updateTracking({ processType: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                {Object.entries(PROCESS_TYPES).map(([code, label]) => (
                  <option key={code} value={code}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Assigned User ID */}
            <div>
              <label htmlFor="assigned-user-id" className="block text-sm font-medium text-gray-700 mb-2">
                업무 생성자 ID
              </label>
              <div className="flex gap-2">
                <input
                  id="assigned-user-id"
                  type="text"
                  value={tracking.assignedTo}
                  onChange={(e) => updateTracking({ assignedTo: e.target.value })}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  placeholder="USER-12345"
                />
                <button
                  type="button"
                  onClick={handleGenerateUserId}
                  className="px-3 py-2 bg-white border border-gray-200 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors whitespace-nowrap"
                >
                  자동 생성
                </button>
              </div>
            </div>

            {/* Assigned User Name */}
            <div>
              <label htmlFor="assigned-user-name" className="block text-sm font-medium text-gray-700 mb-2">
                업무 생성자 이름
              </label>
              <input
                id="assigned-user-name"
                type="text"
                value={tracking.assignedToName}
                onChange={(e) => updateTracking({ assignedToName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 bg-white"
                placeholder="홍길동"
              />
            </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-gray-200 flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-md hover:bg-gray-800 transition-colors"
            >
              완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
