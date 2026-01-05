/**
 * Service for calculating statistics from progress data
 */

import type {
  ProgressData,
  DepartmentStats,
  ProcessTypeStats,
  UserStats,
  TrendData,
  BottleneckData,
  OverallStats,
  FilterOptionsClient,
} from '@task-process/shared-types';
import { differenceInHours, differenceInMinutes, format, parseISO } from 'date-fns';

export class Statistics {
  /**
   * Filter data based on filter options
   */
  static filterData(data: ProgressData[], filters: FilterOptionsClient): ProgressData[] {
    return data.filter((item) => {
      // Date range filter
      if (filters.dateRange.start || filters.dateRange.end) {
        const completedAt = item.completedAt ? parseISO(item.completedAt) : null;
        if (!completedAt) return false;

        if (filters.dateRange.start && completedAt < filters.dateRange.start) {
          return false;
        }
        if (filters.dateRange.end && completedAt > filters.dateRange.end) {
          return false;
        }
      }

      // Department filter
      if (filters.departments.length > 0) {
        if (!filters.departments.includes(item.tracking.departmentId)) {
          return false;
        }
      }

      // Process type filter
      if (filters.processTypes.length > 0) {
        if (!filters.processTypes.includes(item.tracking.processType)) {
          return false;
        }
      }

      // User filter
      if (filters.users.length > 0) {
        if (!filters.users.includes(item.tracking.assignedTo)) {
          return false;
        }
      }

      // Status filter
      if (filters.status.length > 0) {
        if (!filters.status.includes(item.status)) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Calculate overall statistics
   */
  static calculateOverallStats(data: ProgressData[]): OverallStats {
    const completed = data.filter((d) => d.status === 'completed');
    const inProgress = data.filter((d) => d.status === 'in_progress');

    const totalTime = completed.reduce((sum, d) => {
      if (d.startedAt && d.completedAt) {
        return sum + differenceInHours(parseISO(d.completedAt), parseISO(d.startedAt));
      }
      return sum;
    }, 0);

    const departments = new Set(data.map((d) => d.tracking.departmentId));
    const users = new Set(data.map((d) => d.tracking.assignedTo));
    const processTypes = new Set(data.map((d) => d.tracking.processType));

    return {
      totalProcesses: data.length,
      totalCompleted: completed.length,
      totalInProgress: inProgress.length,
      avgCompletionTime: completed.length > 0 ? totalTime / completed.length : 0,
      totalTimeSpent: totalTime,
      uniqueDepartments: departments.size,
      uniqueUsers: users.size,
      uniqueProcessTypes: processTypes.size,
    };
  }

  /**
   * Calculate department statistics
   */
  static calculateDepartmentStats(data: ProgressData[]): DepartmentStats[] {
    const deptMap = new Map<string, ProgressData[]>();

    // Group by department
    data.forEach((item) => {
      const deptId = item.tracking.departmentId;
      if (!deptMap.has(deptId)) {
        deptMap.set(deptId, []);
      }
      deptMap.get(deptId)!.push(item);
    });

    // Calculate stats for each department
    return Array.from(deptMap.entries()).map(([deptId, items]) => {
      const completed = items.filter((d) => d.status === 'completed');
      const totalTime = completed.reduce((sum, d) => {
        if (d.startedAt && d.completedAt) {
          return sum + differenceInHours(parseISO(d.completedAt), parseISO(d.startedAt));
        }
        return sum;
      }, 0);

      const processTypes: Record<string, number> = {};
      items.forEach((item) => {
        const type = item.tracking.processType;
        processTypes[type] = (processTypes[type] || 0) + 1;
      });

      return {
        departmentId: deptId,
        departmentName: items[0].tracking.departmentName,
        totalProcesses: items.length,
        completedProcesses: completed.length,
        avgCompletionTime: completed.length > 0 ? totalTime / completed.length : 0,
        avgTimePerProcess: items.length > 0 ? totalTime / items.length : 0,
        processTypes,
      };
    });
  }

  /**
   * Calculate process type statistics
   */
  static calculateProcessStats(data: ProgressData[]): ProcessTypeStats[] {
    const typeMap = new Map<string, ProgressData[]>();

    // Group by process type
    data.forEach((item) => {
      const type = item.tracking.processType;
      if (!typeMap.has(type)) {
        typeMap.set(type, []);
      }
      typeMap.get(type)!.push(item);
    });

    // Calculate stats for each type
    return Array.from(typeMap.entries()).map(([type, items]) => {
      const completed = items.filter((d) => d.status === 'completed');
      const totalTime = completed.reduce((sum, d) => {
        if (d.startedAt && d.completedAt) {
          return sum + differenceInHours(parseISO(d.completedAt), parseISO(d.startedAt));
        }
        return sum;
      }, 0);

      return {
        processType: type,
        count: items.length,
        completedCount: completed.length,
        avgCompletionTime: completed.length > 0 ? totalTime / completed.length : 0,
        completionRate: items.length > 0 ? (completed.length / items.length) * 100 : 0,
      };
    });
  }

  /**
   * Calculate user statistics
   */
  static calculateUserStats(data: ProgressData[]): UserStats[] {
    const userMap = new Map<string, ProgressData[]>();

    // Group by user
    data.forEach((item) => {
      const userId = item.tracking.assignedTo;
      if (!userMap.has(userId)) {
        userMap.set(userId, []);
      }
      userMap.get(userId)!.push(item);
    });

    // Calculate stats for each user
    return Array.from(userMap.entries()).map(([userId, items]) => {
      const completed = items.filter((d) => d.status === 'completed');
      const totalTime = completed.reduce((sum, d) => {
        if (d.startedAt && d.completedAt) {
          return sum + differenceInHours(parseISO(d.completedAt), parseISO(d.startedAt));
        }
        return sum;
      }, 0);

      const processTypes: Record<string, number> = {};
      items.forEach((item) => {
        const type = item.tracking.processType;
        processTypes[type] = (processTypes[type] || 0) + 1;
      });

      return {
        userId,
        userName: items[0].tracking.assignedToName,
        departmentName: items[0].tracking.departmentName,
        totalProcesses: items.length,
        completedProcesses: completed.length,
        avgCompletionTime: completed.length > 0 ? totalTime / completed.length : 0,
        processTypes,
      };
    });
  }

  /**
   * Calculate trend data by period
   */
  static calculateTrend(
    data: ProgressData[],
    period: 'day' | 'week' | 'month'
  ): TrendData[] {
    const completed = data.filter((d) => d.status === 'completed' && d.completedAt);
    const trendMap = new Map<string, ProgressData[]>();

    // Group by period
    completed.forEach((item) => {
      if (!item.completedAt) return;

      const date = parseISO(item.completedAt);
      let key: string;

      if (period === 'day') {
        key = format(date, 'yyyy-MM-dd');
      } else if (period === 'week') {
        key = format(date, 'yyyy-ww');
      } else {
        key = format(date, 'yyyy-MM');
      }

      if (!trendMap.has(key)) {
        trendMap.set(key, []);
      }
      trendMap.get(key)!.push(item);
    });

    // Calculate stats for each period
    return Array.from(trendMap.entries())
      .map(([period, items]) => {
        const totalTime = items.reduce((sum, d) => {
          if (d.startedAt && d.completedAt) {
            return sum + differenceInHours(parseISO(d.completedAt), parseISO(d.startedAt));
          }
          return sum;
        }, 0);

        return {
          period,
          completedCount: items.length,
          totalTimeSpent: totalTime,
          avgTimePerProcess: items.length > 0 ? totalTime / items.length : 0,
        };
      })
      .sort((a, b) => a.period.localeCompare(b.period));
  }

  /**
   * Calculate bottleneck analysis
   */
  static calculateBottlenecks(data: ProgressData[]): BottleneckData[] {
    const stepMap = new Map<string, number[]>();

    // Collect all step durations
    data.forEach((item) => {
      Object.values(item.stepProgress).forEach((step) => {
        if (step.status === 'completed' && step.startedAt && step.completedAt) {
          const duration = differenceInMinutes(
            parseISO(step.completedAt),
            parseISO(step.startedAt)
          );

          const key = `${item.tracking.processType}::${step.stepTitle}`;
          if (!stepMap.has(key)) {
            stepMap.set(key, []);
          }
          stepMap.get(key)!.push(duration);
        }
      });
    });

    // Calculate stats for each step
    return Array.from(stepMap.entries())
      .map(([key, durations]) => {
        const [processType, stepTitle] = key.split('::');
        const avg = durations.length > 0
          ? durations.reduce((a, b) => a + b, 0) / durations.length
          : 0;
        const sorted = [...durations].sort((a, b) => a - b);
        const p90Index = Math.floor(sorted.length * 0.9);

        return {
          stepTitle,
          processType,
          avgTimeSpent: avg,
          occurrences: durations.length,
          percentile90: sorted[p90Index] || 0,
        };
      })
      .sort((a, b) => b.avgTimeSpent - a.avgTimeSpent);
  }

  /**
   * Get unique values for filters
   */
  static getFilterOptions(data: ProgressData[]): {
    departments: Array<{ id: string; name: string }>;
    processTypes: string[];
    users: Array<{ id: string; name: string }>;
  } {
    const deptMap = new Map<string, string>();
    const userMap = new Map<string, string>();
    const processTypes = new Set<string>();

    data.forEach((item) => {
      deptMap.set(item.tracking.departmentId, item.tracking.departmentName);
      userMap.set(item.tracking.assignedTo, item.tracking.assignedToName);
      processTypes.add(item.tracking.processType);
    });

    return {
      departments: Array.from(deptMap.entries()).map(([id, name]) => ({ id, name })),
      processTypes: Array.from(processTypes).sort(),
      users: Array.from(userMap.entries()).map(([id, name]) => ({ id, name })),
    };
  }
}
