# Dashboard App Test Plan

**Seed:** `e2e/seed.spec.ts`
**App URL:** http://localhost:5175

---

## 1. Process Progress Monitoring

### 1.1 View Active Processes List
**Steps:**
1. Navigate to the Dashboard app
2. Click on "진행 중인 프로세스" (Active Processes) tab
3. Verify the process list is displayed

**Expected:**
- List of active processes is shown
- Each process shows: name, status, progress bar, assigned user, due date
- Processes are sorted by start date (newest first)

### 1.2 Filter Processes by Department
**Steps:**
1. Open the filter panel
2. Select "IT팀" from department filter
3. Click "적용" (Apply) button

**Expected:**
- Only IT department processes are shown
- Process count is updated
- Filter tag "IT팀" appears above the list

### 1.3 Filter Processes by Date Range
**Steps:**
1. Open the filter panel
2. Set start date: 7 days ago
3. Set end date: today
4. Click "적용" (Apply) button

**Expected:**
- Only processes within date range are shown
- Date range is displayed in filter summary
- Clear filter button is available

### 1.4 Search Processes by Name
**Steps:**
1. Enter "테스트" in the search box
2. Wait for search results

**Expected:**
- Real-time search results appear
- Processes matching "테스트" are highlighted
- Non-matching processes are filtered out

### 1.5 View Process Details
**Steps:**
1. Click on a process from the list
2. View the process detail panel

**Expected:**
- Detail panel slides in from the right
- Shows: process name, description, current step, progress percentage
- Shows: activity log with timestamps
- Shows: assigned users and approvers

---

## 2. Statistics and Analytics

### 2.1 View Overall Statistics
**Steps:**
1. Navigate to "통계" (Statistics) tab
2. View the statistics dashboard

**Expected:**
- Total processes count is displayed
- Completed processes count is shown
- Average completion time is calculated
- Completion rate percentage is shown

### 2.2 View Department Statistics
**Steps:**
1. Scroll to "부서별 통계" (Department Statistics) section
2. View the department comparison chart

**Expected:**
- Bar chart shows all departments
- Each department shows: total processes, completed count, avg time
- Departments are sorted by total processes (descending)

### 2.3 View Process Type Distribution
**Steps:**
1. Scroll to "프로세스 유형별 분포" (Process Type Distribution) section
2. View the pie chart

**Expected:**
- Pie chart shows all process types
- Each slice shows: type name, count, percentage
- Hovering shows detailed tooltip

### 2.4 View Trend Chart
**Steps:**
1. Scroll to "추세 분석" (Trend Analysis) section
2. Select date range: "최근 30일" (Last 30 days)
3. View the line chart

**Expected:**
- Line chart shows daily process counts
- Shows: started processes, completed processes
- X-axis shows dates, Y-axis shows counts
- Hovering shows exact values

### 2.5 Identify Bottlenecks
**Steps:**
1. Scroll to "병목 분석" (Bottleneck Analysis) section
2. View the bottleneck list

**Expected:**
- List shows process steps with longest avg duration
- Each item shows: step name, avg time, process count
- Red/yellow/green indicator for severity

---

## 3. File Upload and Progress Import

### 3.1 Upload Single Progress File
**Steps:**
1. Navigate to "파일 업로드" (File Upload) tab
2. Click "파일 선택" (Choose File) button
3. Select a valid JSON progress file
4. Click "업로드" (Upload) button

**Expected:**
- File is uploaded successfully
- Progress data is imported
- Success message: "1개 파일 업로드 완료"
- Progress appears in the list

### 3.2 Upload Multiple Progress Files
**Steps:**
1. Click "파일 선택" (Choose File) button
2. Select 5 JSON progress files (multi-select)
3. Click "업로드" (Upload) button

**Expected:**
- All 5 files are uploaded
- Progress bar shows upload status for each file
- Success message: "5개 파일 업로드 완료"
- All progress data is imported

### 3.3 Handle Invalid File Format
**Steps:**
1. Click "파일 선택" button
2. Select a .txt file (invalid format)
3. Try to upload

**Expected:**
- Error message: "JSON 형식의 파일만 업로드 가능합니다"
- File is not uploaded
- User can select another file

### 3.4 Handle Corrupted JSON File
**Steps:**
1. Upload a JSON file with invalid syntax
2. Observe the error handling

**Expected:**
- Error message: "파일 형식이 올바르지 않습니다"
- File appears with error status in upload list
- Other valid files continue to upload

### 3.5 Remove Uploaded File
**Steps:**
1. Upload a valid file
2. Click "삭제" (Remove) button on the file card
3. Confirm deletion

**Expected:**
- Confirmation dialog appears
- File is removed from the list
- Associated progress data is deleted

---

## 4. Real-time Updates

### 4.1 Auto-refresh Process List
**Steps:**
1. Open the Dashboard
2. Keep it open for 30 seconds
3. (In another tab, update a process status)
4. Return to Dashboard

**Expected:**
- Process list automatically refreshes
- Updated process shows new status
- No manual refresh needed

### 4.2 Live Progress Bar Updates
**Steps:**
1. View a process with in-progress status
2. Watch the progress bar for 10 seconds

**Expected:**
- If process is actively running, progress bar updates
- Percentage updates in real-time
- Animation is smooth

---

## 5. Export Functionality

### 5.1 Export Statistics as CSV
**Steps:**
1. Navigate to "통계" tab
2. Click "내보내기" (Export) button
3. Select "CSV" format
4. Download the file

**Expected:**
- CSV file is downloaded
- File name format: `statistics_YYYY-MM-DD.csv`
- Contains: department, total_processes, completed, avg_time

### 5.2 Export Progress Report as PDF
**Steps:**
1. Navigate to progress detail page
2. Click "PDF 내보내기" (Export PDF) button
3. Download the file

**Expected:**
- PDF file is generated
- Contains: process info, timeline, activity log
- Properly formatted and readable

---

## 6. User Management Features

### 6.1 View User Statistics
**Steps:**
1. Navigate to "사용자별 통계" (User Statistics) section
2. View the user performance list

**Expected:**
- List shows all users
- Each user shows: name, assigned processes, completed count, avg completion time
- Users are sorted by efficiency score

### 6.2 Filter by Assigned User
**Steps:**
1. Open filter panel
2. Select user "홍길동" from user filter
3. Apply filter

**Expected:**
- Only processes assigned to "홍길동" are shown
- User filter tag appears
- Count reflects filtered results

---

## 7. Mobile Responsiveness

### 7.1 View Dashboard on Mobile
**Steps:**
1. Resize browser to mobile width (375px)
2. Navigate through different tabs
3. Try filtering and searching

**Expected:**
- Layout adapts to mobile screen
- All features remain accessible
- Charts resize appropriately
- Touch interactions work smoothly

---

## 8. Performance and Edge Cases

### 8.1 Handle Large Dataset
**Steps:**
1. Load dashboard with 1000+ processes
2. Scroll through the list
3. Apply filters

**Expected:**
- List uses virtual scrolling
- Smooth scrolling performance
- Filters apply quickly
- No browser freeze or lag

### 8.2 Handle Empty State
**Steps:**
1. Clear all filters
2. Navigate to a department with no processes
3. View the empty state

**Expected:**
- Friendly empty state message
- Suggestion to create a process or adjust filters
- Illustrative icon or image

### 8.3 Handle Network Timeout
**Steps:**
1. Enable slow 3G network in DevTools
2. Try to load statistics
3. Wait for timeout

**Expected:**
- Loading spinner appears
- After timeout: error message with retry button
- Retry button reloads data
- Previous data (if any) remains visible

---

## 9. Accessibility

### 9.1 Keyboard Navigation
**Steps:**
1. Use Tab key to navigate through dashboard
2. Use Enter to activate buttons
3. Use Arrow keys to navigate lists

**Expected:**
- All interactive elements are keyboard accessible
- Focus indicators are visible
- Logical tab order
- No keyboard traps

### 9.2 Screen Reader Support
**Steps:**
1. Enable screen reader (NVDA/JAWS)
2. Navigate through dashboard
3. Listen to announcements

**Expected:**
- Headings are properly announced
- Charts have text alternatives
- Status updates are announced
- Form labels are associated correctly
