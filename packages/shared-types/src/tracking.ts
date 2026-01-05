import { z } from 'zod'

/**
 * 부서 상수
 */
export const DEPARTMENTS = {
  HR: 'HR',
  IT: 'IT',
  SALES: 'SALES',
  FIN: 'FIN',
  MKT: 'MKT',
  OPS: 'OPS',
  CS: 'CS',
} as const

export const DEPARTMENT_NAMES: Record<string, string> = {
  HR: '인사팀',
  IT: 'IT팀',
  SALES: '영업팀',
  FIN: '재무팀',
  MKT: '마케팅팀',
  OPS: '운영팀',
  CS: '고객서비스팀',
}

/**
 * 우선순위 스키마
 */
export const PrioritySchema = z.enum(['low', 'medium', 'high', 'urgent'])
export type Priority = z.infer<typeof PrioritySchema>

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: '낮음',
  medium: '보통',
  high: '높음',
  urgent: '긴급',
}

/**
 * 추적 설정 스키마
 */
export const TrackingConfigSchema = z.object({
  organizationId: z.string(),
  departmentId: z.string(),
  departmentName: z.string(),
  processType: z.string(),
  priority: PrioritySchema,
  assignedTo: z.string(),
  assignedToName: z.string(),
  assignedToEmail: z.string().email().optional(),
  createdBy: z.string().optional(),
  createdByName: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  dueDate: z.string().datetime(),
  estimatedHours: z.number().min(0),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
})

export type TrackingConfig = z.infer<typeof TrackingConfigSchema>

/**
 * 추적 정보 스키마 (간소화 버전)
 */
export const TrackingInfoSchema = z.object({
  organizationId: z.string(),
  departmentId: z.string(),
  departmentName: z.string(),
  processType: z.string(),
  priority: PrioritySchema.optional(),
  assignedTo: z.string(),
  assignedToName: z.string(),
  createdBy: z.string().optional(),
  createdAt: z.string().datetime().optional(),
  dueDate: z.string().datetime().optional(),
  estimatedHours: z.number().min(0).optional(),
})

export type TrackingInfo = z.infer<typeof TrackingInfoSchema>
