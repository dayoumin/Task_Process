import { describe, it, expect } from 'vitest'
import {
  TrackingConfigSchema,
  TrackingInfoSchema,
  PrioritySchema,
  DEPARTMENTS,
  PRIORITY_LABELS,
} from './tracking'

describe('TrackingConfigSchema', () => {
  it('정상적인 TrackingConfig 데이터 검증', () => {
    const validData = {
      organizationId: 'org-123',
      departmentId: 'dept-456',
      departmentName: 'IT팀',
      processType: '업무 자동화',
      priority: 'high' as const,
      assignedTo: 'user-789',
      assignedToName: '홍길동',
      assignedToEmail: 'hong@example.com',
      dueDate: new Date().toISOString(),
      estimatedHours: 8,
    }

    // Traditional assertion
    const result = TrackingConfigSchema.parse(validData)
    expect(result).toBeDefined()
    expect(result.organizationId).toBe('org-123')
    expect(result.priority).toBe('high')
    expect(result.estimatedHours).toBe(8)

    // Using custom matcher
    expect(validData).toBeValidZodSchema(TrackingConfigSchema)
  })

  it('필수 필드 누락 시 에러', () => {
    const invalidData = {
      organizationId: 'org-123',
      // departmentId 누락
      departmentName: 'IT팀',
      processType: '업무 자동화',
      priority: 'high',
    }

    expect(() => TrackingConfigSchema.parse(invalidData)).toThrow()
  })

  it('잘못된 이메일 형식 검증', () => {
    const invalidEmail = {
      organizationId: 'org-123',
      departmentId: 'dept-456',
      departmentName: 'IT팀',
      processType: '업무 자동화',
      priority: 'high' as const,
      assignedTo: 'user-789',
      assignedToName: '홍길동',
      assignedToEmail: 'invalid-email',  // 잘못된 이메일
      dueDate: new Date().toISOString(),
      estimatedHours: 8,
    }

    expect(() => TrackingConfigSchema.parse(invalidEmail)).toThrow()
  })

  it('음수 estimatedHours 거부', () => {
    const negativeHours = {
      organizationId: 'org-123',
      departmentId: 'dept-456',
      departmentName: 'IT팀',
      processType: '업무 자동화',
      priority: 'medium' as const,
      assignedTo: 'user-789',
      assignedToName: '홍길동',
      dueDate: new Date().toISOString(),
      estimatedHours: -5,  // 음수
    }

    expect(() => TrackingConfigSchema.parse(negativeHours)).toThrow()
  })

  it('선택적 필드 (tags, notes) 검증', () => {
    const withOptional = {
      organizationId: 'org-123',
      departmentId: 'dept-456',
      departmentName: 'IT팀',
      processType: '업무 자동화',
      priority: 'urgent' as const,
      assignedTo: 'user-789',
      assignedToName: '홍길동',
      dueDate: new Date().toISOString(),
      estimatedHours: 8,
      tags: ['긴급', 'AI'],
      notes: '중요한 작업입니다',
    }

    const result = TrackingConfigSchema.parse(withOptional)

    expect(result.tags).toEqual(['긴급', 'AI'])
    expect(result.notes).toBe('중요한 작업입니다')
  })
})

describe('PrioritySchema', () => {
  it('유효한 priority 값 검증', () => {
    expect(PrioritySchema.parse('low')).toBe('low')
    expect(PrioritySchema.parse('medium')).toBe('medium')
    expect(PrioritySchema.parse('high')).toBe('high')
    expect(PrioritySchema.parse('urgent')).toBe('urgent')
  })

  it('잘못된 priority 값 거부', () => {
    expect(() => PrioritySchema.parse('invalid')).toThrow()
    expect(() => PrioritySchema.parse('super-high')).toThrow()
  })
})

describe('DEPARTMENTS', () => {
  it('모든 부서 상수 정의 확인', () => {
    expect(DEPARTMENTS.HR).toBe('HR')
    expect(DEPARTMENTS.IT).toBe('IT')
    expect(DEPARTMENTS.SALES).toBe('SALES')
    expect(DEPARTMENTS.FIN).toBe('FIN')
    expect(DEPARTMENTS.MKT).toBe('MKT')
    expect(DEPARTMENTS.OPS).toBe('OPS')
    expect(DEPARTMENTS.CS).toBe('CS')
  })

  it('부서 수 확인', () => {
    expect(Object.keys(DEPARTMENTS)).toHaveLength(7)
  })
})

describe('PRIORITY_LABELS', () => {
  it('모든 priority 레이블 확인', () => {
    expect(PRIORITY_LABELS.low).toBe('낮음')
    expect(PRIORITY_LABELS.medium).toBe('보통')
    expect(PRIORITY_LABELS.high).toBe('높음')
    expect(PRIORITY_LABELS.urgent).toBe('긴급')
  })
})

describe('TrackingInfoSchema', () => {
  it('간소화된 TrackingInfo 검증', () => {
    const validInfo = {
      organizationId: 'org-123',
      departmentId: 'dept-456',
      departmentName: 'IT팀',
      processType: '업무 자동화',
      assignedTo: 'user-789',
      assignedToName: '홍길동',
    }

    const result = TrackingInfoSchema.parse(validInfo)

    expect(result).toBeDefined()
    expect(result.departmentName).toBe('IT팀')
  })

  it('선택적 필드가 없어도 검증 통과', () => {
    const minimalInfo = {
      organizationId: 'org-123',
      departmentId: 'dept-456',
      departmentName: 'IT팀',
      processType: '업무 자동화',
      assignedTo: 'user-789',
      assignedToName: '홍길동',
    }

    const result = TrackingInfoSchema.parse(minimalInfo)

    expect(result.priority).toBeUndefined()
    expect(result.dueDate).toBeUndefined()
    expect(result.estimatedHours).toBeUndefined()
  })
})
