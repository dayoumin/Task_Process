import { z } from 'zod'
import { NodeSchema, ChecklistItemSchema, ProcessFieldSchema } from './node'
import { TrackingConfigSchema } from './tracking'

/**
 * 엣지 (연결선) 스키마
 */
export const EdgeSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  label: z.string().optional(),
})

export type Edge = z.infer<typeof EdgeSchema>

/**
 * 프로세스 메타데이터 스키마
 */
export const ProcessMetadataSchema = z.object({
  name: z.string().min(1, '프로세스 이름을 입력해주세요').max(100),
  description: z.string().optional(),
  department: z.string().optional(),
  version: z.string().default('1.0.0'),
  createdAt: z.string().datetime().default(() => new Date().toISOString()),
  updatedAt: z.string().datetime().default(() => new Date().toISOString()),
})

export type ProcessMetadata = z.infer<typeof ProcessMetadataSchema>

/**
 * 프로세스 스키마
 */
export const ProcessSchema = z.object({
  id: z.string().uuid(),
  metadata: ProcessMetadataSchema,
  nodes: z.array(NodeSchema).min(1, '최소 1개 이상의 노드가 필요합니다'),
  edges: z.array(EdgeSchema),
})

export type Process = z.infer<typeof ProcessSchema>

/**
 * 프로세스 실행 상태
 */
export const ProcessExecutionStatusSchema = z.enum([
  'not_started',
  'in_progress',
  'completed',
  'paused',
])

export type ProcessExecutionStatus = z.infer<typeof ProcessExecutionStatusSchema>

/**
 * 프로세스 실행 스키마
 */
export const ProcessExecutionSchema = z.object({
  processId: z.string().uuid(),
  status: ProcessExecutionStatusSchema,
  currentNodeId: z.string().optional(),
  completedNodeIds: z.array(z.string()).default([]),
  startedAt: z.string().datetime().optional(),
  completedAt: z.string().datetime().optional(),
  executionData: z.record(z.unknown()).default({}),
})

export type ProcessExecution = z.infer<typeof ProcessExecutionSchema>

/**
 * 프로세스 스텝 스키마 (Builder용)
 */
export const ProcessStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  checklist: z.array(ChecklistItemSchema),
  fields: z.array(ProcessFieldSchema),
})

export type ProcessStep = z.infer<typeof ProcessStepSchema>

/**
 * 프로세스 데이터 스키마 (Builder용)
 */
export const ProcessDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  version: z.string(),
  tracking: TrackingConfigSchema,
  steps: z.array(ProcessStepSchema),
})

export type ProcessData = z.infer<typeof ProcessDataSchema>
