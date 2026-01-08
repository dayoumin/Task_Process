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
  const triggerElementRef = useRef<HTMLElement | null>(null);

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
    if (!isOpen) {
      // Restore focus when modal closes
      triggerElementRef.current?.focus();
      return;
    }

    // Save the element that triggered the modal
    triggerElementRef.current = document.activeElement as HTMLElement;

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
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
    >
      <div
        ref={modalRef}
        className="bg-white w-full max-w-md max-h-[85vh] overflow-hidden border border-gray-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="h-14 px-6 border-b border-gray-200 flex items-center justify-between">
          <h2 id="settings-title" className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Process Settings
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Close Settings"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 overflow-y-auto max-h-[calc(85vh-120px)]">
            <div className="space-y-5">
              {/* Department */}
              <div>
                <label htmlFor="department-select" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Department
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
                  className="w-full h-10 px-3 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:border-gray-900 bg-white"
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
              <label htmlFor="process-type-select" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Process Type
              </label>
              <select
                id="process-type-select"
                value={tracking.processType}
                onChange={(e) => updateTracking({ processType: e.target.value })}
                className="w-full h-10 px-3 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:border-gray-900 bg-white"
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
              <label htmlFor="assigned-user-id" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Creator ID
              </label>
              <div className="flex gap-2">
                <input
                  id="assigned-user-id"
                  type="text"
                  value={tracking.assignedTo}
                  onChange={(e) => updateTracking({ assignedTo: e.target.value })}
                  className="flex-1 h-10 px-3 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:border-gray-900 bg-white"
                  placeholder="USER-12345"
                />
                <button
                  type="button"
                  onClick={handleGenerateUserId}
                  className="h-10 px-4 bg-white border border-gray-300 text-gray-700 text-xs font-medium hover:bg-gray-50 hover:border-gray-400 transition-all whitespace-nowrap"
                >
                  Generate
                </button>
              </div>
            </div>

            {/* Assigned User Name */}
            <div>
              <label htmlFor="assigned-user-name" className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                Creator Name
              </label>
              <input
                id="assigned-user-name"
                type="text"
                value={tracking.assignedToName}
                onChange={(e) => updateTracking({ assignedToName: e.target.value })}
                className="w-full h-10 px-3 text-sm text-gray-900 border border-gray-300 focus:outline-none focus:border-gray-900 bg-white"
                placeholder="Full name"
              />
            </div>
            </div>
          </div>

          {/* Footer */}
          <div className="h-14 px-6 border-t border-gray-200 flex items-center justify-end">
            <button
              type="submit"
              className="h-10 px-6 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
