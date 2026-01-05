import { useState } from 'react';
import { Button } from '@task-process/shared-ui';
import { AlertCircle, CheckCircle, Info, XCircle } from 'lucide-react';

export default function DesignSystem() {
  const [buttonStates, setButtonStates] = useState({
    primary: false,
    secondary: false,
    outline: false,
  });

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Buttons
        </h3>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <Button
                variant="primary"
                onClick={() =>
                  setButtonStates((s) => ({ ...s, primary: !s.primary }))
                }
              >
                Primary Button
              </Button>
              <Button
                variant="secondary"
                onClick={() =>
                  setButtonStates((s) => ({ ...s, secondary: !s.secondary }))
                }
              >
                Secondary Button
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setButtonStates((s) => ({ ...s, outline: !s.outline }))
                }
              >
                Outline Button
              </Button>
              <Button variant="ghost">Ghost Button</Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" size="sm">
                Small
              </Button>
              <Button variant="primary" size="md">
                Medium
              </Button>
              <Button variant="primary" size="lg">
                Large
              </Button>
            </div>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" disabled>
                Disabled
              </Button>
              <Button variant="primary" className="w-full">
                Full Width
              </Button>
            </div>
          </div>
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Button States: Primary {buttonStates.primary ? 'ON' : 'OFF'},
              Secondary {buttonStates.secondary ? 'ON' : 'OFF'}, Outline{' '}
              {buttonStates.outline ? 'ON' : 'OFF'}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Colors
        </h3>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Primary', color: 'bg-blue-500' },
              { name: 'Success', color: 'bg-green-500' },
              { name: 'Warning', color: 'bg-yellow-500' },
              { name: 'Danger', color: 'bg-red-500' },
              { name: 'Gray 50', color: 'bg-gray-50' },
              { name: 'Gray 100', color: 'bg-gray-100' },
              { name: 'Gray 200', color: 'bg-gray-200' },
              { name: 'Gray 300', color: 'bg-gray-300' },
            ].map((item) => (
              <div key={item.name} className="space-y-2">
                <div className={`${item.color} h-20 rounded-lg border border-gray-200 dark:border-gray-700`} />
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Alerts
        </h3>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100">
                  Information
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  This is an informational alert with additional context.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-900 dark:text-green-100">
                  Success
                </h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Operation completed successfully!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900 dark:text-yellow-100">
                  Warning
                </h4>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Please review this warning message carefully.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-900 dark:text-red-100">
                  Error
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  An error occurred. Please try again.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Typography
        </h3>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="space-y-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Heading 1
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                4xl / Bold
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
                Heading 2
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                3xl / Semibold
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Heading 3
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                2xl / Semibold
              </p>
            </div>
            <div>
              <p className="text-base text-gray-900 dark:text-white">
                Body text - Regular paragraph with normal weight
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Base / Regular
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Small text - Used for captions and secondary information
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                SM / Regular
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
