import type { TrackingConfig } from '@task-process/shared-types';

export class TrackingService {
  /**
   * Generate organization ID: CORP-YYYY
   */
  static generateOrganizationId(): string {
    const year = new Date().getFullYear();
    return `CORP-${year}`;
  }

  /**
   * Generate department ID: DEPT-{CODE}
   */
  static generateDepartmentId(code: string): string {
    return `DEPT-${code.toUpperCase()}`;
  }

  /**
   * Generate user ID: USER-{5-digit number}
   */
  static generateUserId(sequenceNumber?: number): string {
    const num = sequenceNumber
      ? sequenceNumber.toString().padStart(5, '0')
      : Math.floor(Math.random() * 100000).toString().padStart(5, '0');
    return `USER-${num}`;
  }

  /**
   * Generate process ID: PROC-{YYYYMMDD}-{4-digit number}
   */
  static generateProcessId(): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const num = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `PROC-${date}-${num}`;
  }

  /**
   * Generate progress ID: PROG-{timestamp}
   */
  static generateProgressId(): string {
    return `PROG-${Date.now()}`;
  }

  /**
   * Validate tracking configuration
   */
  static validateTracking(tracking: TrackingConfig): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!tracking.organizationId) {
      errors.push('조직 ID가 필요합니다');
    }
    if (!tracking.departmentId) {
      errors.push('부서 ID가 필요합니다');
    }
    if (!tracking.assignedTo) {
      errors.push('담당자 ID가 필요합니다');
    }
    if (!tracking.assignedToName) {
      errors.push('담당자 이름이 필요합니다');
    }
    if (!tracking.dueDate) {
      errors.push('마감일이 필요합니다');
    }
    if (!tracking.priority) {
      errors.push('우선순위가 필요합니다');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
