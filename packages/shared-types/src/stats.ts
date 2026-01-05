import { z } from 'zod'

/**
 * 부서별 통계 스키마
 */
export const DepartmentStatsSchema = z.object({
  departmentId: z.string(),
  departmentName: z.string(),
  totalProcesses: z.number().min(0),
  completedProcesses: z.number().min(0),
  avgCompletionTime: z.number().min(0), // hours
  avgTimePerProcess: z.number().min(0), // hours
  processTypes: z.record(z.number()),
})

export type DepartmentStats = z.infer<typeof DepartmentStatsSchema>

/**
 * 프로세스 유형별 통계 스키마
 */
export const ProcessTypeStatsSchema = z.object({
  processType: z.string(),
  count: z.number().min(0),
  completedCount: z.number().min(0),
  avgCompletionTime: z.number().min(0), // hours
  completionRate: z.number().min(0).max(100), // percentage
})

export type ProcessTypeStats = z.infer<typeof ProcessTypeStatsSchema>

/**
 * 사용자별 통계 스키마
 */
export const UserStatsSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  departmentName: z.string(),
  totalProcesses: z.number().min(0),
  completedProcesses: z.number().min(0),
  avgCompletionTime: z.number().min(0), // hours
  processTypes: z.record(z.number()),
})

export type UserStats = z.infer<typeof UserStatsSchema>

/**
 * 추세 데이터 스키마
 */
export const TrendDataSchema = z.object({
  period: z.string(), // 'YYYY-MM-DD' or 'YYYY-WW' or 'YYYY-MM'
  completedCount: z.number().min(0),
  totalTimeSpent: z.number().min(0), // hours
  avgTimePerProcess: z.number().min(0), // hours
})

export type TrendData = z.infer<typeof TrendDataSchema>

/**
 * 병목 구간 데이터 스키마
 */
export const BottleneckDataSchema = z.object({
  stepTitle: z.string(),
  processType: z.string(),
  avgTimeSpent: z.number().min(0), // minutes
  occurrences: z.number().min(0),
  percentile90: z.number().min(0), // 90th percentile time
})

export type BottleneckData = z.infer<typeof BottleneckDataSchema>

/**
 * 전체 통계 스키마
 */
export const OverallStatsSchema = z.object({
  totalProcesses: z.number().min(0),
  totalCompleted: z.number().min(0),
  totalInProgress: z.number().min(0),
  avgCompletionTime: z.number().min(0), // hours
  totalTimeSpent: z.number().min(0), // hours
  uniqueDepartments: z.number().min(0),
  uniqueUsers: z.number().min(0),
  uniqueProcessTypes: z.number().min(0),
})

export type OverallStats = z.infer<typeof OverallStatsSchema>

/**
 * 필터 옵션 스키마
 */
export const FilterOptionsSchema = z.object({
  dateRange: z.object({
    start: z.string().datetime().nullable(),
    end: z.string().datetime().nullable(),
  }),
  departments: z.array(z.string()),
  processTypes: z.array(z.string()),
  users: z.array(z.string()),
  status: z.array(z.string()),
})

export type FilterOptions = z.infer<typeof FilterOptionsSchema>

/**
 * 필터 옵션 (브라우저 환경용 - Date 객체 사용)
 * Dashboard 앱에서 사용
 */
export interface FilterOptionsClient {
  dateRange: {
    start: Date | null
    end: Date | null
  }
  departments: string[]
  processTypes: string[]
  users: string[]
  status: string[]
}
