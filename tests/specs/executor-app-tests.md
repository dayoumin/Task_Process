# Process Executor App Test Plan

**Seed:** `e2e/seed.spec.ts`
**App URL:** http://localhost:5174

---

## 1. Process Execution Flow

### 1.1 Start New Process Instance
**Steps:**
1. Navigate to the Process Executor app
2. Click "새 프로세스 시작" (Start New Process) button
3. Select process "테스트 프로세스 1" from the dropdown
4. Click "시작" (Start) button

**Expected:**
- Process instance is created
- Redirected to process execution view
- First step (Start node) is highlighted
- Process status is "in_progress"

### 1.2 Complete Form Input Step
**Steps:**
1. View the form input step
2. Enter "홍길동" in "사용자 이름" field
3. Enter "hong@example.com" in "이메일" field
4. Click "다음" (Next) button

**Expected:**
- Form validation passes
- Data is saved to execution context
- Progress advances to next step (Approval node)
- Progress bar updates (e.g., 33% → 66%)

### 1.3 Complete Approval Step
**Steps:**
1. View the approval step
2. Click "승인" (Approve) button
3. Enter approval comment: "승인합니다"
4. Confirm approval

**Expected:**
- Approval is recorded
- Comment is saved to activity log
- Progress advances to next step
- Approver name and timestamp are saved

### 1.4 Complete Process Execution
**Steps:**
1. Reach the end node
2. Click "완료" (Complete) button
3. View completion summary

**Expected:**
- Process status changes to "completed"
- Completion timestamp is recorded
- Summary shows: start time, end time, total duration
- Success message: "프로세스가 완료되었습니다"

---

## 2. Process Navigation

### 2.1 Navigate Between Steps
**Steps:**
1. Start a process
2. Complete step 1
3. Click "이전" (Previous) button
4. View step 1 again
5. Click "다음" (Next) to return to step 2

**Expected:**
- Previous button works correctly
- Previously entered data is preserved
- Can navigate back and forth without data loss
- Current step indicator updates

### 2.2 View Process Progress Sidebar
**Steps:**
1. During process execution
2. View the sidebar showing all steps
3. Click on a completed step in the sidebar

**Expected:**
- Sidebar shows all steps with status icons
- Completed steps have checkmark icon
- Current step is highlighted
- Clicking navigates to that step

---

## 3. Form Validation

### 3.1 Required Field Validation
**Steps:**
1. Start a process with a form step
2. Leave required field "사용자 이름" empty
3. Click "다음" button

**Expected:**
- Error message: "사용자 이름을 입력해주세요"
- Cannot proceed to next step
- Field is highlighted in red
- Focus moves to the error field

### 3.2 Email Format Validation
**Steps:**
1. Enter invalid email "hong@invalid" in email field
2. Click "다음" button

**Expected:**
- Error message: "올바른 이메일 형식을 입력해주세요"
- Field shows validation error
- Cannot proceed

### 3.3 Number Field Validation
**Steps:**
1. In a number field
2. Enter "abc" (non-numeric)
3. Observe validation

**Expected:**
- Field only accepts numeric input
- Error message if invalid
- Can enter positive/negative numbers

### 3.4 Date Field Validation
**Steps:**
1. In a date field
2. Try to enter invalid date "2024-13-40"
3. Observe validation

**Expected:**
- Date picker prevents invalid dates
- If manually entered, validation error appears
- Error message: "올바른 날짜를 선택해주세요"

---

## 4. Process Pause and Resume

### 4.1 Pause Process Execution
**Steps:**
1. Start a process
2. Complete step 1
3. Click "일시정지" (Pause) button
4. Confirm pause

**Expected:**
- Process status changes to "paused"
- Current progress is saved
- Pause timestamp is recorded
- Process appears in "Paused Processes" list

### 4.2 Resume Paused Process
**Steps:**
1. Navigate to "일시정지된 프로세스" (Paused Processes) list
2. Click on a paused process
3. Click "재개" (Resume) button

**Expected:**
- Process status changes back to "in_progress"
- Execution continues from where it was paused
- All previous data is preserved
- Resume timestamp is recorded

---

## 5. Activity Log

### 5.1 View Activity Log
**Steps:**
1. During process execution
2. Open "활동 로그" (Activity Log) panel
3. View the log entries

**Expected:**
- All steps are logged with timestamps
- Each entry shows: timestamp, action, user, details
- Logs are in reverse chronological order (newest first)

### 5.2 Log User Actions
**Steps:**
1. Complete a form step
2. Approve a step
3. Navigate to previous step
4. View activity log

**Expected:**
- Form submission is logged
- Approval action is logged with comment
- Navigation actions may be logged
- Each log has accurate timestamp

---

## 6. Conditional Branching

### 6.1 Execute Conditional Path (Approved)
**Steps:**
1. Start a process with conditional node
2. Complete approval step and approve
3. Observe the next step

**Expected:**
- Process follows "approved" branch
- Correct next step is shown based on condition
- Activity log shows branch decision

### 6.2 Execute Conditional Path (Rejected)
**Steps:**
1. Start a process with conditional node
2. Complete approval step and reject
3. Observe the next step

**Expected:**
- Process follows "rejected" branch
- Alternative next step is shown
- Rejection reason is logged

---

## 7. Data Persistence

### 7.1 Auto-save During Execution
**Steps:**
1. Start a process
2. Fill in form data
3. Close the browser tab (without clicking Next)
4. Reopen the executor app
5. Navigate to "진행 중인 프로세스" (In Progress)
6. Open the same process

**Expected:**
- Process is auto-saved
- Filled form data is preserved
- Can continue from where left off
- No data loss

### 7.2 Session Recovery
**Steps:**
1. Start a process
2. Complete 2 steps
3. Simulate browser crash (close forcefully)
4. Reopen the app

**Expected:**
- Process is recoverable
- Shows option to "continue" or "start new"
- Clicking "continue" restores state
- All completed steps remain completed

---

## 8. Multi-Process Execution

### 8.1 Run Multiple Process Instances
**Steps:**
1. Start process instance 1
2. Complete step 1, but don't finish
3. Start process instance 2 (different process)
4. Switch between the two instances

**Expected:**
- Both instances run independently
- Data doesn't mix between instances
- Can switch between them without data loss
- Each has its own progress state

---

## 9. Error Handling

### 9.1 Handle Backend Error During Step Submission
**Steps:**
1. (Simulate backend error with DevTools)
2. Complete a form step
3. Click "다음" button
4. Observe error

**Expected:**
- Error message: "처리 중 오류가 발생했습니다"
- Data is retained in the form
- Retry button is available
- Process state is not corrupted

### 9.2 Handle Network Disconnection
**Steps:**
1. Enable offline mode in DevTools
2. Try to complete a step
3. Observe error handling

**Expected:**
- Error message: "네트워크 연결을 확인해주세요"
- Form data is cached locally
- When online, retry automatically or show retry button
- No data loss

### 9.3 Handle Invalid Process Definition
**Steps:**
1. Try to start a process with missing/corrupted definition
2. Observe error

**Expected:**
- Error message: "프로세스 정의를 불러올 수 없습니다"
- User is redirected to process selection
- Error is logged
- Does not crash the app

---

## 10. Notifications and Alerts

### 10.1 Show Success Notification
**Steps:**
1. Complete a step successfully
2. Observe notification

**Expected:**
- Success toast/notification appears
- Message: "단계가 완료되었습니다"
- Auto-dismisses after 3 seconds
- Green checkmark icon

### 10.2 Show Warning for Unsaved Changes
**Steps:**
1. Fill in form data
2. Try to navigate away without saving
3. Observe warning

**Expected:**
- Warning dialog: "저장하지 않은 변경사항이 있습니다"
- Options: "저장하고 나가기", "저장 안함", "취소"
- Clicking "저장하고 나가기" saves and navigates
- Clicking "취소" stays on current page

---

## 11. Accessibility

### 11.1 Keyboard Navigation in Forms
**Steps:**
1. Start a process with form
2. Use Tab to navigate fields
3. Use Enter to submit form
4. Use Shift+Tab to navigate backwards

**Expected:**
- All form fields are keyboard accessible
- Tab order is logical (top to bottom, left to right)
- Enter submits the form
- Focus indicators are visible

### 11.2 Screen Reader Announcements
**Steps:**
1. Enable screen reader
2. Complete a process step
3. Listen to announcements

**Expected:**
- Step completion is announced
- Error messages are announced
- Progress updates are announced
- Form labels are read correctly

---

## 12. Performance

### 12.1 Handle Long-Running Process
**Steps:**
1. Start a process with 20+ steps
2. Complete all steps
3. Monitor performance

**Expected:**
- App remains responsive
- No memory leaks
- Progress bar updates smoothly
- No lag during step transitions

### 12.2 Handle Large Form Data
**Steps:**
1. Fill a form with 50+ fields
2. Submit the form
3. Observe performance

**Expected:**
- Form submission is fast (< 2 seconds)
- No UI freeze
- Data is validated efficiently
- Large data is handled correctly
