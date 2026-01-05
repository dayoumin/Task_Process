import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import type { ZodSchema } from 'zod'

// Cleanup after each test
afterEach(() => {
  cleanup()
})

// Custom matchers for Zod schema validation
interface CustomMatchers<R = unknown> {
  toBeValidZodSchema(schema: ZodSchema): R
  toMatchZodSchema(schema: ZodSchema): R
}

declare module 'vitest' {
  interface Assertion<T = any> extends CustomMatchers<T> {}
  interface AsymmetricMatchersContaining extends CustomMatchers {}
}

expect.extend({
  toBeValidZodSchema(received: unknown, schema: ZodSchema) {
    const result = schema.safeParse(received)

    if (result.success) {
      return {
        pass: true,
        message: () => `Expected data to NOT be valid against Zod schema`,
      }
    } else {
      return {
        pass: false,
        message: () =>
          `Expected data to be valid against Zod schema\n` +
          `Validation errors:\n${JSON.stringify(result.error.format(), null, 2)}`,
      }
    }
  },

  toMatchZodSchema(received: unknown, schema: ZodSchema) {
    const result = schema.safeParse(received)

    if (result.success) {
      return {
        pass: true,
        message: () => `Expected data to NOT match Zod schema`,
      }
    } else {
      return {
        pass: false,
        message: () =>
          `Expected data to match Zod schema\n` +
          `Received: ${JSON.stringify(received, null, 2)}\n` +
          `Errors: ${JSON.stringify(result.error.issues, null, 2)}`,
      }
    }
  },
})
