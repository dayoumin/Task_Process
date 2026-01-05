import { describe, it, expect } from 'vitest'
import {
  ProcessMetadataSchema,
  ProcessExecutionSchema,
  ProcessExecutionStatusSchema,
} from './process'

describe('ProcessMetadataSchema', () => {
  it('정상적인 프로세스 메타데이터 검증', () => {
    const validMetadata = {
      name: '테스트 프로세스',
      description: '테스트용 프로세스입니다',
      department: 'IT팀',
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const result = ProcessMetadataSchema.parse(validMetadata)

    expect(result).toBeDefined()
    expect(result.name).toBe('테스트 프로세스')
    expect(result.version).toBe('1.0.0')
  })

  it('빈 프로세스 이름 거부', () => {
    const emptyName = {
      name: '',  // 빈 문자열
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    expect(() => ProcessMetadataSchema.parse(emptyName)).toThrow('프로세스 이름을 입력해주세요')
  })

  it('100자 초과 프로세스 이름 거부', () => {
    const longName = {
      name: 'a'.repeat(101),  // 101자
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    expect(() => ProcessMetadataSchema.parse(longName)).toThrow()
  })

  it('기본값 (version, createdAt, updatedAt) 자동 생성', () => {
    const minimal = {
      name: '최소 프로세스',
    }

    const result = ProcessMetadataSchema.parse(minimal)

    expect(result.version).toBe('1.0.0')
    expect(result.createdAt).toBeDefined()
    expect(result.updatedAt).toBeDefined()
  })

  it('ISO 8601 날짜 형식 검증', () => {
    const validMetadata = {
      name: '프로세스',
      createdAt: '2026-01-05T10:30:00.000Z',  // ISO 8601
      updatedAt: '2026-01-05T11:00:00.000Z',
    }

    const result = ProcessMetadataSchema.parse(validMetadata)

    expect(result.createdAt).toBe('2026-01-05T10:30:00.000Z')
  })

  it('잘못된 날짜 형식 거부', () => {
    const invalidDate = {
      name: '프로세스',
      createdAt: '2026/01/05',  // 잘못된 형식
    }

    expect(() => ProcessMetadataSchema.parse(invalidDate)).toThrow()
  })
})

describe('ProcessExecutionStatusSchema', () => {
  it('유효한 실행 상태 검증', () => {
    expect(ProcessExecutionStatusSchema.parse('not_started')).toBe('not_started')
    expect(ProcessExecutionStatusSchema.parse('in_progress')).toBe('in_progress')
    expect(ProcessExecutionStatusSchema.parse('paused')).toBe('paused')
    expect(ProcessExecutionStatusSchema.parse('completed')).toBe('completed')
  })

  it('잘못된 실행 상태 거부', () => {
    expect(() => ProcessExecutionStatusSchema.parse('invalid')).toThrow()
    expect(() => ProcessExecutionStatusSchema.parse('pending')).toThrow()
    expect(() => ProcessExecutionStatusSchema.parse('running')).toThrow()
  })
})

describe('ProcessExecutionSchema', () => {
  it('정상적인 프로세스 실행 데이터 검증', () => {
    const validExecution = {
      processId: '123e4567-e89b-12d3-a456-426614174000',
      status: 'in_progress' as const,
      currentNodeId: 'node-1',
      completedNodeIds: ['node-0'],
      startedAt: new Date().toISOString(),
      executionData: {
        userName: '홍길동',
        email: 'hong@example.com',
      },
    }

    const result = ProcessExecutionSchema.parse(validExecution)

    expect(result).toBeDefined()
    expect(result.status).toBe('in_progress')
    expect(result.completedNodeIds).toHaveLength(1)
  })

  it('UUID 형식 processId 검증', () => {
    const invalidUUID = {
      processId: 'not-a-uuid',  // 잘못된 UUID
      status: 'not_started' as const,
    }

    expect(() => ProcessExecutionSchema.parse(invalidUUID)).toThrow()
  })

  it('기본값 (completedNodeIds, executionData) 자동 생성', () => {
    const minimal = {
      processId: '123e4567-e89b-12d3-a456-426614174000',
      status: 'not_started' as const,
    }

    const result = ProcessExecutionSchema.parse(minimal)

    expect(result.completedNodeIds).toEqual([])
    expect(result.executionData).toEqual({})
  })

  it('실행 중 상태에서 startedAt 필드 존재', () => {
    const running = {
      processId: '123e4567-e89b-12d3-a456-426614174000',
      status: 'in_progress' as const,
      startedAt: new Date().toISOString(),
    }

    const result = ProcessExecutionSchema.parse(running)

    expect(result.startedAt).toBeDefined()
  })

  it('완료 상태에서 completedAt 필드 존재', () => {
    const completed = {
      processId: '123e4567-e89b-12d3-a456-426614174000',
      status: 'completed' as const,
      startedAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date().toISOString(),
      completedNodeIds: ['node-0', 'node-1', 'node-2'],
    }

    const result = ProcessExecutionSchema.parse(completed)

    expect(result.completedAt).toBeDefined()
    expect(result.completedNodeIds).toHaveLength(3)
  })

  it('executionData에 임의의 데이터 저장', () => {
    const withData = {
      processId: '123e4567-e89b-12d3-a456-426614174000',
      status: 'in_progress' as const,
      executionData: {
        step1: { approved: true },
        step2: { comment: '확인 완료' },
        customField: 12345,
      },
    }

    const result = ProcessExecutionSchema.parse(withData)

    expect(result.executionData.step1).toEqual({ approved: true })
    expect(result.executionData.customField).toBe(12345)
  })
})
