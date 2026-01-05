import { defineConfig } from 'vitest/config'
import { resolve } from 'path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['packages/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.{ts,js}',
        '**/index.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@task-process/shared-types': resolve(__dirname, './packages/shared-types/src'),
      '@task-process/shared-utils': resolve(__dirname, './packages/shared-utils/src'),
    },
  },
})
