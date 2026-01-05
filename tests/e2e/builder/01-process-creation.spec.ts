// spec: specs/builder-app-tests.md
// seed: e2e/seed.spec.ts

import { test, expect } from '@playwright/test'

const BUILDER_URL = process.env.BUILDER_URL || 'http://localhost:5173'

// TODO: Enable these tests after UI implementation
test.describe.skip('Process Creation and Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(BUILDER_URL)
  })

  test('1.1 Create New Process', async ({ page }) => {
    // 1. Navigate to the Process Builder app
    await page.goto(BUILDER_URL)

    // 2. Click on "새 프로세스" (New Process) button
    await page.click('button:has-text("새 프로세스")')

    // 3. Enter process name "테스트 프로세스 1"
    await page.fill('input[name="processName"]', '테스트 프로세스 1')

    // 4. Enter description "AI가 자동 생성한 테스트 프로세스"
    await page.fill('textarea[name="description"]', 'AI가 자동 생성한 테스트 프로세스')

    // 5. Click "저장" (Save) button
    await page.click('button:has-text("저장")')

    // Expected: Process is created successfully
    // Expected: Process appears in the process list
    await expect(page.locator('text=테스트 프로세스 1')).toBeVisible()

    // Expected: Success notification is displayed
    await expect(page.locator('.toast, .notification, [role="alert"]')).toContainText(/성공|저장|완료/)
  })

  test('1.2 Add Start Node to Process', async ({ page }) => {
    // Prerequisites: Create a process first (or use existing)
    // For demo: assuming process creation UI is available

    // 1. Open the newly created process
    await page.click('text=테스트 프로세스 1')

    // 2. Drag a "시작" (Start) node from the node palette
    // Note: Drag-and-drop requires special handling in Playwright
    const startNode = page.locator('[data-node-type="start"], button:has-text("시작")')
    const canvas = page.locator('.react-flow, [data-testid="canvas"], canvas')

    await startNode.dragTo(canvas)

    // 3. Drop it onto the canvas
    // (dragTo handles this)

    // 4. Click on the start node to select it
    await page.click('.react-flow__node-start, [data-node-type="start"]')

    // Expected: Start node appears on the canvas
    await expect(page.locator('.react-flow__node-start, [data-node-type="start"]')).toBeVisible()

    // Expected: Node is selectable and highlighted when clicked
    await expect(page.locator('.react-flow__node.selected, .node.selected')).toBeVisible()
  })

  test('1.3 Add Form Node to Process', async ({ page }) => {
    // 1. Drag a "폼 입력" (Form Input) node from the palette
    const formNode = page.locator('[data-node-type="form"], button:has-text("폼")')
    const canvas = page.locator('.react-flow, [data-testid="canvas"]')

    await formNode.dragTo(canvas, { targetPosition: { x: 300, y: 200 } })

    // 2. Drop it onto the canvas next to the start node
    // (handled by dragTo)

    // 3. Connect the start node to the form node
    // Note: This may require edge creation UI interaction
    await page.click('.react-flow__node-start .react-flow__handle-right, [data-handle="output"]')
    await page.click('.react-flow__node-form .react-flow__handle-left, [data-handle="input"]')

    // 4. Click on the form node
    await page.click('[data-node-type="form"]')

    // 5. Add form field: label "사용자 이름", type "text", required: true
    await page.click('button:has-text("필드 추가"), button:has-text("Add Field")')
    await page.fill('input[name="fieldLabel"], input[placeholder*="레이블"]', '사용자 이름')
    await page.selectOption('select[name="fieldType"]', 'text')
    await page.check('input[name="required"], input[type="checkbox"]')

    // 6. Add form field: label "이메일", type "email", required: true
    await page.click('button:has-text("필드 추가"), button:has-text("Add Field")')
    await page.fill('input[name="fieldLabel"]:nth-of-type(2)', '이메일')
    await page.selectOption('select[name="fieldType"]:nth-of-type(2)', 'email')
    await page.check('input[name="required"]:nth-of-type(2)')

    // 7. Save the form configuration
    await page.click('button:has-text("저장"), button:has-text("Save")')

    // Expected: Form node is connected to start node
    await expect(page.locator('.react-flow__edge')).toBeVisible()

    // Expected: Form fields are saved correctly
    await expect(page.locator('text=사용자 이름')).toBeVisible()
    await expect(page.locator('text=이메일')).toBeVisible()

    // Expected: Node configuration panel shows the added fields
    await page.click('[data-node-type="form"]')
    await expect(page.locator('.node-config, .properties-panel')).toContainText('사용자 이름')
    await expect(page.locator('.node-config, .properties-panel')).toContainText('이메일')
  })
})
