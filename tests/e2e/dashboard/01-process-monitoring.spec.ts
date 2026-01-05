// spec: specs/dashboard-app-tests.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test'

const DASHBOARD_URL = process.env.DASHBOARD_URL || 'http://localhost:5175'

// TODO: Enable these tests after UI implementation
test.describe.skip('Process Progress Monitoring', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(DASHBOARD_URL)
  })

  test('1.1 View Active Processes List', async ({ page }) => {
    // 1. Navigate to the Dashboard app
    await page.goto(DASHBOARD_URL)

    // 2. Click on "진행 중인 프로세스" (Active Processes) tab
    await page.click('button:has-text("진행 중"), [role="tab"]:has-text("진행")')

    // 3. Verify the process list is displayed
    await expect(page.locator('.process-list, [data-testid="process-list"]')).toBeVisible()

    // Expected: List of active processes is shown
    // Expected: Each process shows: name, status, progress bar, assigned user, due date
    const processCard = page.locator('.process-card, [data-testid="process-card"]').first()

    await expect(processCard.locator('.process-name, [data-testid="process-name"]')).toBeVisible()
    await expect(processCard.locator('.process-status, [data-testid="status"]')).toBeVisible()
    await expect(processCard.locator('.progress-bar, progress, [role="progressbar"]')).toBeVisible()
    await expect(processCard.locator('.assigned-user, [data-testid="assignee"]')).toBeVisible()
    await expect(processCard.locator('.due-date, [data-testid="due-date"]')).toBeVisible()

    // Expected: Processes are sorted by start date (newest first)
    // Verify by checking timestamps or order
  })

  test('1.2 Filter Processes by Department', async ({ page }) => {
    // 1. Open the filter panel
    await page.click('button:has-text("필터"), button:has-text("Filter")')

    // 2. Select "IT팀" from department filter
    await page.click('select[name="department"], [data-testid="department-filter"]')
    await page.click('option:has-text("IT팀"), [role="option"]:has-text("IT")')

    // 3. Click "적용" (Apply) button
    await page.click('button:has-text("적용"), button:has-text("Apply")')

    // Expected: Only IT department processes are shown
    const processList = page.locator('.process-list, [data-testid="process-list"]')
    await expect(processList).toBeVisible()

    // Expected: Process count is updated
    await expect(page.locator('.process-count, [data-testid="count"]')).toBeVisible()

    // Expected: Filter tag "IT팀" appears above the list
    await expect(page.locator('.filter-tag, .chip, .badge')).toContainText('IT')
  })

  test('1.3 Filter Processes by Date Range', async ({ page }) => {
    // 1. Open the filter panel
    await page.click('button:has-text("필터"), button:has-text("Filter")')

    // 2. Set start date: 7 days ago
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 7)
    await page.fill('input[name="startDate"], input[type="date"]:first-of-type',
      startDate.toISOString().split('T')[0])

    // 3. Set end date: today
    const endDate = new Date()
    await page.fill('input[name="endDate"], input[type="date"]:last-of-type',
      endDate.toISOString().split('T')[0])

    // 4. Click "적용" (Apply) button
    await page.click('button:has-text("적용"), button:has-text("Apply")')

    // Expected: Only processes within date range are shown
    await expect(page.locator('.process-list, [data-testid="process-list"]')).toBeVisible()

    // Expected: Date range is displayed in filter summary
    await expect(page.locator('.filter-summary, .active-filters')).toBeVisible()

    // Expected: Clear filter button is available
    await expect(page.locator('button:has-text("초기화"), button:has-text("Clear")')).toBeVisible()
  })

  test('1.4 Search Processes by Name', async ({ page }) => {
    // 1. Enter "테스트" in the search box
    await page.fill('input[type="search"], input[placeholder*="검색"]', '테스트')

    // 2. Wait for search results
    await page.waitForTimeout(500) // debounce delay

    // Expected: Real-time search results appear
    await expect(page.locator('.process-list, [data-testid="process-list"]')).toBeVisible()

    // Expected: Processes matching "테스트" are highlighted
    const highlightedResults = page.locator('.highlight, mark, .search-match')
    if (await highlightedResults.count() > 0) {
      await expect(highlightedResults.first()).toBeVisible()
    }

    // Expected: Non-matching processes are filtered out
    // Verify by checking if all visible process names contain "테스트"
    const processNames = page.locator('.process-name, [data-testid="process-name"]')
    const count = await processNames.count()

    for (let i = 0; i < count; i++) {
      const name = await processNames.nth(i).textContent()
      expect(name).toContain('테스트')
    }
  })

  test('1.5 View Process Details', async ({ page }) => {
    // 1. Click on a process from the list
    await page.click('.process-card:first-of-type, [data-testid="process-card"]:first-of-type')

    // 2. View the process detail panel
    const detailPanel = page.locator('.detail-panel, .sidebar, [data-testid="detail-panel"]')

    // Expected: Detail panel slides in from the right
    await expect(detailPanel).toBeVisible()

    // Expected: Shows: process name, description, current step, progress percentage
    await expect(detailPanel.locator('.process-name, h2, h3')).toBeVisible()
    await expect(detailPanel.locator('.description, p')).toBeVisible()
    await expect(detailPanel.locator('.current-step, [data-testid="current-step"]')).toBeVisible()
    await expect(detailPanel.locator('.progress-percentage, [data-testid="progress"]')).toBeVisible()

    // Expected: Shows: activity log with timestamps
    await expect(detailPanel.locator('.activity-log, [data-testid="activity-log"]')).toBeVisible()
    await expect(detailPanel.locator('.timestamp, time')).toBeVisible()

    // Expected: Shows: assigned users and approvers
    await expect(detailPanel.locator('.assigned-users, [data-testid="assignees"]')).toBeVisible()
  })
})
