import { z } from 'zod'
import { TrackingInfoSchema } from './tracking'

/**
 * 프로세스 상태 스키마
 */
export const ProcessStatusSchema = z.enum(['draft', 'in_progress', 'completed', 'archived'])
export type ProcessStatus = z.infer<typeof ProcessStatusSchema>

/**
 * 단계 진행 상태 스키마
 */
export const StepStatusSchema = z.enum(['pending', 'in_progress', 'completed'])
export type StepStatus = z.infer<typeof StepStatusSchema>

/**
 * 단계 진행 정보 스키마
 */
export const StepProgressSchema = z.object({
  stepId: z.string(),
  stepTitle: z.string(),
  status: StepStatusSchema,
  startedAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
  timeSpent: z.number().min(0).optional(), // seconds
  completedChecklist: z.array(z.string()).optional(),
  fieldValues: z.record(z.unknown()).optional(),
})

export type StepProgress = z.infer<typeof StepProgressSchema>

/**
 * 활동 로그 스키마
 */
export const ActivityLogSchema = z.object({
  timestamp: z.string().datetime(),
  action: z.string(),
  stepId: z.string().optional(),
  userId: z.string().optional(),
  details: z.string().optional(),
})

export type ActivityLog = z.infer<typeof ActivityLogSchema>

/**
 * 진행 데이터 스키마
 */
export const ProgressDataSchema = z.object({
  id: z.string().uuid(),
  processId: z.string().uuid(),
  processName: z.string(),
  version: z.string().optional(),
  tracking: TrackingInfoSchema,
  status: ProcessStatusSchema,
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime().optional(),
  currentStep: z.number().min(0),
  totalSteps: z.number().min(0),
  stepProgress: z.record(StepProgressSchema),
  completedSteps: z.array(z.string()),
  logs: z.array(ActivityLogSchema).optional(),
})

export type ProgressData = z.infer<typeof ProgressDataSchema>

/**
 * 업로드된 파일 상태
 */
export const UploadStatusSchema = z.enum(['pending', 'parsing', 'success', 'error'])
export type UploadStatus = z.infer<typeof UploadStatusSchema>

/**
 * 업로드된 파일 스키마 (File 객체 제외)
 */
export const UploadedFileDataSchema = z.object({
  fileName: z.string(),
  data: ProgressDataSchema.optional(),
  error: z.string().optional(),
  status: UploadStatusSchema,
})

export type UploadedFileData = z.infer<typeof UploadedFileDataSchema>

/**
 * 업로드된 파일 (브라우저 환경용 - File 객체 포함)
 * Dashboard 앱에서 사용
 */
export interface UploadedFile {
  file: File
  data?: ProgressData
  error?: string
  status: UploadStatus
}
