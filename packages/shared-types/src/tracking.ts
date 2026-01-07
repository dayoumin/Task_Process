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
 * 업무 유형 상수 (고정된 선택지)
 */
export const PROCESS_TYPES: Record<string, string> = {
  'BUDGET_EXECUTION': '예산-집행',
  'BUDGET_EXPENDITURE': '예산-지출',
  'BUDGET_PLANNING': '예산-계획',
  'HR_RECRUITMENT': '인사-채용',
  'HR_EVALUATION': '인사-평가',
  'HR_ONBOARDING': '인사-온보딩',
  'HR_LEAVE': '인사-휴가신청',
  'PURCHASE_REQUEST': '구매-요청',
  'PURCHASE_CONTRACT': '구매-계약',
  'PURCHASE_PAYMENT': '구매-대금지급',
  'APPROVAL_DOCUMENT': '결재-문서',
  'APPROVAL_EXPENSE': '결재-경비',
  'GENERAL': '일반업무',
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
