import { test, expect } from '@playwright/test'

const BUILDER_URL = process.env.BUILDER_URL || 'http://localhost:5173'
const DASHBOARD_URL = process.env.DASHBOARD_URL || 'http://localhost:5175'
const EXECUTOR_URL = process.env.EXECUTOR_URL || 'http://localhost:5174'

test.describe('Environment Setup', () => {
  test('builder app is accessible', async ({ page }) => {
    await page.goto(BUILDER_URL)
    await expect(page).toHaveTitle(/admin-builder/i)
  })

  test('dashboard app is accessible', async ({ page }) => {
    await page.goto(DASHBOARD_URL)
    await expect(page).toHaveTitle(/admin-dashboard/i)
  })

  test('executor app is accessible', async ({ page }) => {
    await page.goto(EXECUTOR_URL)
    await expect(page).toHaveTitle(/업무 프로세스 실행기/i)
  })
})
