import { useState, useEffect, useRef } from 'react';
import { Download } from 'lucide-react';
import { useMultiProcessStore } from '../../stores/multi-process-store';
import { ExportService } from '../../services/export-service';
import { TrackingService } from '../../services/tracking-service';

export function ExportButton() {
  const { getActiveProcess } = useMultiProcessStore();
  const [showError, setShowError] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const activeProcess = getActiveProcess();

  useEffect(() => {
    if (!showError) return;

    // Focus modal when it opens
    modalRef.current?.focus();

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowError(false);
      }
    };

    const handleTab = (e: KeyboardEvent) => {
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'button, [tabindex]:not([tabindex="-1"])'
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
  }, [showError]);

  useEffect(() => {
    if (!showError && buttonRef.current) {
      // Return focus to button when modal closes
      buttonRef.current.focus();
    }
  }, [showError]);

  const handleExport = () => {
    if (!activeProcess) {
      setErrors(['활성화된 프로세스가 없습니다.']);
      setShowError(true);
      return;
    }

    const { nodes, edges, name, processId, tracking } = activeProcess;

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
      const data = ExportService.generateJSON(nodes, edges, name, tracking, processId);
      const filename = `${name.replace(/\s+/g, '-')}.json`;
      ExportService.downloadFile(data, filename);

      setShowError(false);
      setErrors([]);
    } catch (error) {
      const userMessage = '내보내기 중 오류가 발생했습니다. 다시 시도해주세요.';
      if (import.meta.env.DEV) {
        console.error('Export error:', error);
      }
      setErrors([userMessage]);
      setShowError(true);
    }
  };

  return (
    <div>
      <button
        ref={buttonRef}
        onClick={handleExport}
        disabled={!activeProcess}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="프로세스 JSON 파일로 내보내기"
      >
        <Download size={16} />
        Export
      </button>

      {showError && (
        <div
          className="fixed inset-0 bg-black/20 flex items-center justify-center z-50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="error-title"
          onClick={() => setShowError(false)}
        >
          <div
            ref={modalRef}
            className="bg-white rounded-lg p-5 max-w-md w-full border border-gray-200 shadow-lg"
            onClick={(e) => e.stopPropagation()}
            tabIndex={-1}
          >
            <h3 id="error-title" className="text-base font-semibold text-red-600 mb-3">
              검증 오류
            </h3>
            <ul className="space-y-1 mb-4" role="list">
              {errors.map((error, index) => (
                <li key={index} className="text-sm text-gray-700">
                  • {error}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowError(false)}
              className="w-full px-4 py-2 bg-gray-900 text-white text-sm hover:bg-gray-800 rounded-md transition-colors font-medium"
              autoFocus
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
