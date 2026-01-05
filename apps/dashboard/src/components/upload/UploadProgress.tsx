/**
 * Upload progress display component
 */

import React from 'react';
import type { UploadedFile } from '@task-process/shared-types';

interface UploadProgressProps {
  files: UploadedFile[];
  onClear: () => void;
}

export const UploadProgress: React.FC<UploadProgressProps> = ({ files, onClear }) => {
  const successCount = files.filter((f) => f.status === 'success').length;
  const errorCount = files.filter((f) => f.status === 'error').length;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Upload Results</h3>
        <button
          onClick={onClear}
          className="text-sm text-red-600 hover:text-red-800 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{files.length}</div>
          <div className="text-sm text-gray-600">Total Files</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{successCount}</div>
          <div className="text-sm text-gray-600">Successful</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{errorCount}</div>
          <div className="text-sm text-gray-600">Errors</div>
        </div>
      </div>

      <div className="max-h-48 overflow-y-auto space-y-2">
        {files.map((file, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 rounded ${
              file.status === 'success'
                ? 'bg-green-50'
                : file.status === 'error'
                  ? 'bg-red-50'
                  : 'bg-gray-50'
            }`}
          >
            <div className="flex items-center flex-1">
              <span className="mr-2">
                {file.status === 'success' ? '✓' : file.status === 'error' ? '✗' : '⋯'}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{file.file.name}</div>
                {file.data && (
                  <div className="text-xs text-gray-500">{file.data.processName}</div>
                )}
                {file.error && <div className="text-xs text-red-600">{file.error}</div>}
              </div>
            </div>
            <div className="text-xs text-gray-400 ml-4">
              {(file.file.size / 1024).toFixed(1)} KB
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
