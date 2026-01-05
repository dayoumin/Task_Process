/**
 * Service for parsing ZIP files exported from User Executor
 */

import JSZip from 'jszip';
import type { ProgressData, UploadedFile } from '@task-process/shared-types';

export class ZipParser {
  /**
   * Validate progress data structure
   */
  private static validateProgressData(data: unknown): ProgressData {
    if (typeof data !== 'object' || data === null) {
      throw new Error('Invalid JSON: expected object');
    }

    const obj = data as Record<string, unknown>;

    // Validate required string fields
    if (typeof obj.id !== 'string' || !obj.id) {
      throw new Error('Invalid or missing field: id');
    }
    if (typeof obj.processId !== 'string' || !obj.processId) {
      throw new Error('Invalid or missing field: processId');
    }
    if (typeof obj.processName !== 'string' || !obj.processName) {
      throw new Error('Invalid or missing field: processName');
    }

    // Validate tracking object
    if (typeof obj.tracking !== 'object' || obj.tracking === null) {
      throw new Error('Invalid or missing field: tracking');
    }

    const tracking = obj.tracking as Record<string, unknown>;
    if (
      typeof tracking.organizationId !== 'string' ||
      typeof tracking.departmentId !== 'string' ||
      typeof tracking.departmentName !== 'string' ||
      typeof tracking.processType !== 'string' ||
      typeof tracking.assignedTo !== 'string' ||
      typeof tracking.assignedToName !== 'string'
    ) {
      throw new Error('Invalid tracking fields');
    }

    // Validate status
    const validStatuses = ['draft', 'in_progress', 'completed', 'archived'];
    if (!validStatuses.includes(obj.status as string)) {
      throw new Error(`Invalid status: ${obj.status}`);
    }

    // Validate stepProgress exists
    if (typeof obj.stepProgress !== 'object' || obj.stepProgress === null) {
      throw new Error('Invalid or missing field: stepProgress');
    }

    return obj as unknown as ProgressData;
  }

  /**
   * Parse a single ZIP file and extract progress.json
   */
  static async parseZipFile(file: File): Promise<ProgressData> {
    try {
      const zip = await JSZip.loadAsync(file);

      // Look for progress.json
      const progressFile = zip.file('progress.json');
      if (!progressFile) {
        throw new Error('progress.json not found in ZIP file');
      }

      const content = await progressFile.async('string');
      const parsedData = JSON.parse(content);

      // Validate data structure
      const data = this.validateProgressData(parsedData);

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to parse ZIP: ${error.message}`);
      }
      throw new Error('Failed to parse ZIP: Unknown error');
    }
  }

  /**
   * Parse multiple ZIP files in parallel
   */
  static async parseMultipleZips(files: File[]): Promise<UploadedFile[]> {
    const results: UploadedFile[] = [];

    for (const file of files) {
      const uploadedFile: UploadedFile = {
        file,
        status: 'parsing',
      };

      try {
        const data = await this.parseZipFile(file);
        uploadedFile.data = data;
        uploadedFile.status = 'success';
      } catch (error) {
        uploadedFile.error = error instanceof Error ? error.message : 'Unknown error';
        uploadedFile.status = 'error';
      }

      results.push(uploadedFile);
    }

    return results;
  }

  /**
   * Validate if a file is a valid ZIP
   */
  static async validateZipFile(file: File): Promise<boolean> {
    if (!file.name.endsWith('.zip')) {
      return false;
    }

    try {
      const zip = await JSZip.loadAsync(file);
      return zip.file('progress.json') !== null;
    } catch {
      return false;
    }
  }

  /**
   * Get list of files in a ZIP
   */
  static async getZipContents(file: File): Promise<string[]> {
    const zip = await JSZip.loadAsync(file);
    return Object.keys(zip.files);
  }
}
