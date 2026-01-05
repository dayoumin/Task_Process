import { z } from 'zod'

/**
 * 노드 타입 정의
 */
export const NodeTypeSchema = z.enum([
  'start',
  'task',
  'decision',
  'end',
  'checklist',
  'form',
])

export type NodeType = z.infer<typeof NodeTypeSchema>

/**
 * 체크리스트 아이템 스키마
 */
export const ChecklistItemSchema = z.object({
  id: z.string(),
  text: z.string().min(1, '체크리스트 항목을 입력해주세요'),
  checked: z.boolean().default(false),
  required: z.boolean().default(false),
})

export type ChecklistItem = z.infer<typeof ChecklistItemSchema>

/**
 * 폼 필드 타입
 */
export const FormFieldTypeSchema = z.enum(['text', 'number', 'date', 'select', 'textarea'])

export type FormFieldType = z.infer<typeof FormFieldTypeSchema>

/**
 * 폼 필드 스키마
 */
export const FormFieldSchema = z.object({
  id: z.string(),
  label: z.string().min(1, '필드 레이블을 입력해주세요'),
  type: FormFieldTypeSchema,
  required: z.boolean().default(false),
  options: z.array(z.string()).optional(), // for select type
  value: z.union([z.string(), z.number()]).optional(),
})

export type FormField = z.infer<typeof FormFieldSchema>

/**
 * Process Field 타입 (Builder용)
 */
export const ProcessFieldTypeSchema = z.enum(['text', 'number', 'file', 'date', 'textarea'])

export type ProcessFieldType = z.infer<typeof ProcessFieldTypeSchema>

/**
 * Field Validation 스키마 (Builder용)
 */
export const FieldValidationSchema = z.object({
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  pattern: z.string().optional(),
  accept: z.string().optional(),
  maxSize: z.number().optional(),
})

export type FieldValidation = z.infer<typeof FieldValidationSchema>

/**
 * Process Field 스키마 (Builder용)
 */
export const ProcessFieldSchema = z.object({
  id: z.string(),
  type: ProcessFieldTypeSchema,
  label: z.string().min(1, '필드 레이블을 입력해주세요'),
  required: z.boolean().default(false),
  placeholder: z.string().optional(),
  validation: FieldValidationSchema.optional(),
})

export type ProcessField = z.infer<typeof ProcessFieldSchema>

/**
 * 노드 데이터 스키마
 */
export const NodeDataSchema = z.object({
  label: z.string().min(1, '노드 레이블을 입력해주세요'),
  type: NodeTypeSchema,
  description: z.string().optional(),
  checklist: z.array(ChecklistItemSchema).optional(),
  formFields: z.array(FormFieldSchema).optional(),
  fields: z.array(ProcessFieldSchema).optional(), // Builder용 fields
  title: z.string().optional(), // Builder용 title
})

export type NodeData = z.infer<typeof NodeDataSchema>

/**
 * 노드 스키마 (React Flow 호환)
 */
export const NodeSchema = z.object({
  id: z.string(),
  type: NodeTypeSchema,
  data: NodeDataSchema,
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
})

export type Node = z.infer<typeof NodeSchema>
