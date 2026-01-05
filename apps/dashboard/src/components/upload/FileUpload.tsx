/**
 * File upload component with drag & drop support
 */

import React, { useCallback, useState } from 'react';
import type { UploadedFile } from '@task-process/shared-types';
import { ZipParser } from '../../services/zip-parser';

interface FileUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
  isLoading: boolean;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MAX_FILES = 100;

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesUploaded, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      const fileArray = Array.from(files).filter((f) => f.name.endsWith('.zip'));

      if (fileArray.length === 0) {
        alert('Please upload ZIP files only');
        return;
      }

      // Validate file sizes
      const oversizedFiles = fileArray.filter((f) => f.size > MAX_FILE_SIZE);
      if (oversizedFiles.length > 0) {
        alert(
          `Files too large (max ${MAX_FILE_SIZE / 1024 / 1024}MB): ${oversizedFiles
            .map((f) => f.name)
            .join(', ')}`
        );
        return;
      }

      // Validate file count
      if (fileArray.length > MAX_FILES) {
        alert(`Too many files (max ${MAX_FILES})`);
        return;
      }

      try {
        const results = await ZipParser.parseMultipleZips(fileArray);
        onFilesUploaded(results);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to parse files');
      }
    },
    [onFilesUploaded]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files);
    },
    [handleFiles]
  );

  return (
    <div
      className={`file-upload-zone ${isDragging ? 'drag-over' : ''} ${
        isLoading ? 'opacity-50 pointer-events-none' : ''
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="flex flex-col items-center">
        <svg
          className="w-16 h-16 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>

        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          {isLoading ? 'Parsing files...' : 'Upload Process ZIP Files'}
        </h3>

        <p className="text-sm text-gray-500 mb-4">
          Drag and drop ZIP files here, or click to browse
        </p>

        <label className="filter-button cursor-pointer">
          <span>Select Files</span>
          <input
            type="file"
            multiple
            accept=".zip"
            onChange={handleFileInput}
            className="hidden"
            disabled={isLoading}
          />
        </label>

        <p className="text-xs text-gray-400 mt-4">
          Supports multiple ZIP file uploads. Each file should contain a progress.json.
        </p>
      </div>
    </div>
  );
};
