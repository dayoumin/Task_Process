import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Log to production error tracking (if available)
    if (import.meta.env.PROD) {
      // Store error in localStorage for debugging
      try {
        const errorLog = {
          timestamp: new Date().toISOString(),
          error: error.toString(),
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          userAgent: navigator.userAgent,
        };

        const existingLogs = localStorage.getItem('error-logs');
        const logs = existingLogs ? JSON.parse(existingLogs) : [];
        logs.push(errorLog);

        // Keep only last 10 errors
        if (logs.length > 10) {
          logs.shift();
        }

        localStorage.setItem('error-logs', JSON.stringify(logs));
      } catch (storageError) {
        // Silently fail if localStorage is not available
        console.error('Failed to store error log:', storageError);
      }

      // TODO: Integrate with external error tracking service
      // Examples:
      // - Sentry.captureException(error, { contexts: { react: errorInfo } });
      // - fetch('/api/log-error', { method: 'POST', body: JSON.stringify({ error, errorInfo }) });
    }

    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    // Optionally reload the page
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full bg-white border border-gray-300 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-50 flex items-center justify-center border border-red-200">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">오류가 발생했습니다</h1>
                <p className="text-sm text-gray-600">애플리케이션에 예기치 않은 오류가 발생했습니다</p>
              </div>
            </div>

            {this.state.error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200">
                <p className="text-xs font-mono text-red-800 break-all">
                  {this.state.error.toString()}
                </p>
              </div>
            )}

            {import.meta.env.DEV && this.state.errorInfo && (
              <details className="mb-6 p-4 bg-gray-50 border border-gray-200">
                <summary className="text-xs font-semibold text-gray-700 cursor-pointer uppercase tracking-wider">
                  오류 상세 정보 (개발 모드)
                </summary>
                <pre className="mt-3 text-xs text-gray-600 overflow-auto max-h-40">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-2 mb-4">
              <button
                onClick={this.handleReset}
                className="flex-1 h-10 px-4 bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                페이지 새로고침
              </button>
              <button
                onClick={() => window.history.back()}
                className="flex-1 h-10 px-4 bg-white border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-400 transition-all"
              >
                이전 페이지
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              문제가 계속되면 관리자에게 문의하세요
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
