/**
 * Utility functions for exporting data to CSV/PDF
 */

import type {
  DepartmentStats,
  ProcessTypeStats,
  UserStats,
  OverallStats,
} from '@task-process/shared-types';

/**
 * Escape CSV value to prevent CSV Injection attacks
 */
function escapeCSV(value: unknown): string {
  const str = String(value ?? '');

  // Prevent CSV Injection (formulas starting with =, +, -, @)
  if (str.startsWith('=') || str.startsWith('+') ||
      str.startsWith('@') || str.startsWith('-')) {
    return `'${str}`;  // Prefix with single quote
  }

  // Escape quotes and wrap in quotes if needed
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

/**
 * Convert array of objects to CSV string
 */
function arrayToCSV(data: Record<string, unknown>[]): string {
  if (data.length === 0) return '';

  const headers = Object.keys(data[0]);
  const rows = data.map((row) =>
    headers.map((header) => {
      const value = row[header];
      if (typeof value === 'object' && value !== null) {
        return escapeCSV(JSON.stringify(value));
      }
      return escapeCSV(value);
    })
  );

  return [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');
}

/**
 * Download CSV file
 */
function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Export department statistics to CSV
 */
export function exportDepartmentStats(data: DepartmentStats[]) {
  const csv = arrayToCSV(
    data.map((d) => ({
      Department: d.departmentName,
      'Total Processes': d.totalProcesses,
      'Completed Processes': d.completedProcesses,
      'Avg Completion Time (hours)': d.avgCompletionTime.toFixed(2),
      'Process Types': Object.entries(d.processTypes)
        .map(([k, v]) => `${k}:${v}`)
        .join('; '),
    }))
  );

  downloadCSV(csv, 'department-stats.csv');
}

/**
 * Export process type statistics to CSV
 */
export function exportProcessStats(data: ProcessTypeStats[]) {
  const csv = arrayToCSV(
    data.map((d) => ({
      'Process Type': d.processType,
      'Total Count': d.count,
      'Completed Count': d.completedCount,
      'Avg Completion Time (hours)': d.avgCompletionTime.toFixed(2),
      'Completion Rate (%)': d.completionRate.toFixed(1),
    }))
  );

  downloadCSV(csv, 'process-type-stats.csv');
}

/**
 * Export user statistics to CSV
 */
export function exportUserStats(data: UserStats[]) {
  const csv = arrayToCSV(
    data.map((d) => ({
      User: d.userName,
      'User ID': d.userId,
      Department: d.departmentName,
      'Total Processes': d.totalProcesses,
      'Completed Processes': d.completedProcesses,
      'Avg Completion Time (hours)': d.avgCompletionTime > 0 ? d.avgCompletionTime.toFixed(2) : '0.00',
      'Completion Rate (%)': d.totalProcesses > 0
        ? ((d.completedProcesses / d.totalProcesses) * 100).toFixed(1)
        : '0.0',
    }))
  );

  downloadCSV(csv, 'user-stats.csv');
}

/**
 * Export overall summary to CSV
 */
export function exportOverallStats(
  overall: OverallStats,
  departments: DepartmentStats[],
  processTypes: ProcessTypeStats[]
) {
  const summary = [
    ['Overall Statistics', ''],
    ['Total Processes', overall.totalProcesses],
    ['Completed Processes', overall.totalCompleted],
    ['In Progress', overall.totalInProgress],
    ['Avg Completion Time (hours)', overall.avgCompletionTime.toFixed(2)],
    ['Total Time Spent (hours)', overall.totalTimeSpent.toFixed(2)],
    ['Unique Departments', overall.uniqueDepartments],
    ['Unique Users', overall.uniqueUsers],
    ['Unique Process Types', overall.uniqueProcessTypes],
    ['', ''],
    ['Department Statistics', ''],
    ['Department', 'Total Processes', 'Completed', 'Avg Time (hours)'],
    ...departments.map((d) => [
      d.departmentName,
      d.totalProcesses,
      d.completedProcesses,
      d.avgCompletionTime.toFixed(2),
    ]),
    ['', ''],
    ['Process Type Statistics', ''],
    ['Process Type', 'Count', 'Completed', 'Completion Rate (%)'],
    ...processTypes.map((d) => [
      d.processType,
      d.count,
      d.completedCount,
      d.completionRate.toFixed(1),
    ]),
  ];

  const csv = summary.map((row) =>
    row.map(cell => escapeCSV(cell)).join(',')
  ).join('\n');
  downloadCSV(csv, 'overall-report.csv');
}

/**
 * Print current view
 */
export function printReport() {
  window.print();
}
