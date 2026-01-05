// spec: specs/executor-app-tests.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test'

const EXECUTOR_URL = process.env.EXECUTOR_URL || 'http://localhost:5174'

// TODO: Enable these tests after UI implementation
test.describe.skip('Process Execution Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(EXECUTOR_URL)
  })

  test('1.1 Start New Process Instance', async ({ page }) => {
    // 1. Navigate to the Process Executor app
    await page.goto(EXECUTOR_URL)

    // 2. Click "새 프로세스 시작" (Start New Process) button
    await page.click('button:has-text("새 프로세스 시작"), button:has-text("Start")')

    // 3. Select process "테스트 프로세스 1" from the dropdown
    await page.click('select[name="processId"], [data-testid="process-select"]')
    await page.click('option:has-text("테스트 프로세스 1"), [role="option"]:has-text("테스트")')

    // 4. Click "시작" (Start) button
    await page.click('button:has-text("시작"), button[type="submit"]')

    // Expected: Process instance is created
    // Expected: Redirected to process execution view
    await expect(page).toHaveURL(/\/execute\/|\/process\//)

    // Expected: First step (Start node) is highlighted
    await expect(page.locator('.step.active, .node.current, [data-step="0"].active')).toBeVisible()

    // Expected: Process status is "in_progress"
    await expect(page.locator('.status, [data-testid="status"]')).toContainText(/진행|progress/)
  })

  test('1.2 Complete Form Input Step', async ({ page }) => {
    // Prerequisites: Start a process instance first
    await page.click('button:has-text("새 프로세스 시작")')
    await page.selectOption('select[name="processId"]', { label: '테스트 프로세스 1' })
    await page.click('button:has-text("시작")')

    // 1. View the form input step
    await expect(page.locator('form, [data-testid="form"]')).toBeVisible()

    // 2. Enter "홍길동" in "사용자 이름" field
    await page.fill('input[name="userName"], input[placeholder*="이름"]', '홍길동')

    // 3. Enter "hong@example.com" in "이메일" field
    await page.fill('input[name="email"], input[type="email"]', 'hong@example.com')

    // 4. Click "다음" (Next) button
    await page.click('button:has-text("다음"), button:has-text("Next")')

    // Expected: Form validation passes
    // (no error messages should be visible)

    // Expected: Data is saved to execution context
    // Expected: Progress advances to next step (Approval node)
    await expect(page.locator('.step.active, [data-step="1"].active')).toBeVisible()

    // Expected: Progress bar updates (e.g., 33% → 66%)
    const progressBar = page.locator('progress, [role="progressbar"]')
    const progressValue = await progressBar.getAttribute('value')
    expect(Number(progressValue)).toBeGreaterThan(0)
  })

  test('1.3 Complete Approval Step', async ({ page }) => {
    // Prerequisites: Complete form step first
    // (For demo purposes, assuming we're already at approval step)

    // 1. View the approval step
    await expect(page.locator('.approval-step, [data-step-type="approval"]')).toBeVisible()

    // 2. Click "승인" (Approve) button
    await page.click('button:has-text("승인"), button:has-text("Approve")')

    // 3. Enter approval comment: "승인합니다"
    await page.fill('textarea[name="comment"], textarea[placeholder*="코멘트"]', '승인합니다')

    // 4. Confirm approval
    await page.click('button:has-text("확인"), button[type="submit"]')

    // Expected: Approval is recorded
    // Expected: Comment is saved to activity log
    await expect(page.locator('.activity-log, [data-testid="log"]')).toContainText('승인합니다')

    // Expected: Progress advances to next step
    await expect(page.locator('.step.active, .node.current')).toBeVisible()

    // Expected: Approver name and timestamp are saved
    await expect(page.locator('.activity-log time, .timestamp')).toBeVisible()
  })

  test('1.4 Complete Process Execution', async ({ page }) => {
    // Prerequisites: Reach the end node
    // (For demo, assuming we're at the final step)

    // 1. Reach the end node
    // (navigation steps omitted for brevity)

    // 2. Click "완료" (Complete) button
    await page.click('button:has-text("완료"), button:has-text("Complete")')

    // 3. View completion summary
    const summary = page.locator('.summary, .completion-screen, [data-testid="summary"]')
    await expect(summary).toBeVisible()

    // Expected: Process status changes to "completed"
    await expect(page.locator('.status, [data-testid="status"]')).toContainText(/완료|completed/)

    // Expected: Completion timestamp is recorded
    await expect(summary.locator('time, .timestamp')).toBeVisible()

    // Expected: Summary shows: start time, end time, total duration
    await expect(summary).toContainText(/시작|start/i)
    await expect(summary).toContainText(/종료|end/i)
    await expect(summary).toContainText(/소요|duration/i)

    // Expected: Success message: "프로세스가 완료되었습니다"
    await expect(page.locator('.toast, .notification, [role="alert"]')).toContainText(/완료|success/)
  })
})

// TODO: Enable these tests after UI implementation
test.describe.skip('Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(EXECUTOR_URL)
  })

  test('3.1 Required Field Validation', async ({ page }) => {
    // Setup: Start a process with a form step
    await page.click('button:has-text("새 프로세스 시작")')
    await page.selectOption('select[name="processId"]', { index: 0 })
    await page.click('button:has-text("시작")')

    // 1. Start a process with a form step
    await expect(page.locator('form, [data-testid="form"]')).toBeVisible()

    // 2. Leave required field "사용자 이름" empty
    await page.fill('input[name="userName"]', '')

    // 3. Click "다음" button
    await page.click('button:has-text("다음"), button:has-text("Next")')

    // Expected: Error message: "사용자 이름을 입력해주세요"
    await expect(page.locator('.error, [role="alert"], .field-error')).toContainText(/이름|required/i)

    // Expected: Cannot proceed to next step
    // (We should still be on the form step)
    await expect(page.locator('form, [data-testid="form"]')).toBeVisible()

    // Expected: Field is highlighted in red
    await expect(page.locator('input[name="userName"]')).toHaveClass(/error|invalid/)

    // Expected: Focus moves to the error field
    await expect(page.locator('input[name="userName"]')).toBeFocused()
  })

  test('3.2 Email Format Validation', async ({ page }) => {
    // Setup
    await page.click('button:has-text("새 프로세스 시작")')
    await page.selectOption('select[name="processId"]', { index: 0 })
    await page.click('button:has-text("시작")')

    // 1. Enter invalid email "hong@invalid" in email field
    await page.fill('input[type="email"], input[name="email"]', 'hong@invalid')

    // 2. Click "다음" button
    await page.click('button:has-text("다음")')

    // Expected: Error message: "올바른 이메일 형식을 입력해주세요"
    await expect(page.locator('.error, [role="alert"]')).toContainText(/이메일|email/i)

    // Expected: Field shows validation error
    await expect(page.locator('input[type="email"]')).toHaveClass(/error|invalid/)

    // Expected: Cannot proceed
    await expect(page.locator('form')).toBeVisible()
  })
})
