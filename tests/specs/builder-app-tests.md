# Process Builder App Test Plan

**Seed:** `e2e/seed.spec.ts`
**App URL:** http://localhost:5173

---

## 1. Process Creation and Management

### 1.1 Create New Process
**Steps:**
1. Navigate to the Process Builder app
2. Click on "새 프로세스" (New Process) button
3. Enter process name "테스트 프로세스 1"
4. Enter description "AI가 자동 생성한 테스트 프로세스"
5. Click "저장" (Save) button

**Expected:**
- Process is created successfully
- Process appears in the process list
- Success notification is displayed

### 1.2 Add Start Node to Process
**Steps:**
1. Open the newly created process
2. Drag a "시작" (Start) node from the node palette
3. Drop it onto the canvas
4. Click on the start node to select it

**Expected:**
- Start node appears on the canvas
- Node is selectable and highlighted when clicked

### 1.3 Add Form Node to Process
**Steps:**
1. Drag a "폼 입력" (Form Input) node from the palette
2. Drop it onto the canvas next to the start node
3. Connect the start node to the form node
4. Click on the form node
5. Add form field: label "사용자 이름", type "text", required: true
6. Add form field: label "이메일", type "email", required: true
7. Save the form configuration

**Expected:**
- Form node is connected to start node
- Form fields are saved correctly
- Node configuration panel shows the added fields

### 1.4 Add Approval Node
**Steps:**
1. Drag an "승인" (Approval) node from the palette
2. Connect the form node to the approval node
3. Click on the approval node
4. Set approver to "관리자"
5. Set approval criteria to "필수"
6. Save the approval configuration

**Expected:**
- Approval node is connected correctly
- Approver settings are saved
- Node shows approver information

### 1.5 Add End Node and Complete Process
**Steps:**
1. Drag an "종료" (End) node from the palette
2. Connect the approval node to the end node
3. Save the entire process
4. Verify the process flow is complete

**Expected:**
- End node is connected
- Process saves successfully
- Process flow is valid with no errors

---

## 2. Process Tracking Configuration

### 2.1 Add Tracking Information
**Steps:**
1. Open the process created in test 1.1
2. Click on "추적 설정" (Tracking Settings) tab
3. Select organization: "테스트 조직"
4. Select department: "IT팀"
5. Set process type: "업무 자동화"
6. Set priority: "높음" (High)
7. Assign to: "테스트 사용자"
8. Set due date: 7 days from today
9. Set estimated hours: 8
10. Add tags: "테스트", "자동화"
11. Save tracking configuration

**Expected:**
- All tracking fields are filled correctly
- Configuration saves successfully
- Tracking info is displayed on process card

---

## 3. Process Validation

### 3.1 Validate Incomplete Process
**Steps:**
1. Create a new process without nodes
2. Try to save the process
3. Observe validation error

**Expected:**
- Error message: "프로세스에 최소 1개의 노드가 필요합니다"
- Process is not saved

### 3.2 Validate Disconnected Nodes
**Steps:**
1. Create a process with start node and form node
2. Do NOT connect the nodes
3. Try to save the process

**Expected:**
- Warning message about disconnected nodes
- User can choose to save anyway or fix connections

---

## 4. Process Export/Import

### 4.1 Export Process as JSON
**Steps:**
1. Open the process created in test 1.5
2. Click "내보내기" (Export) button
3. Select format: JSON
4. Download the file

**Expected:**
- JSON file is downloaded
- File contains all process data including nodes, edges, metadata, and tracking info

### 4.2 Import Process from JSON
**Steps:**
1. Click "가져오기" (Import) button
2. Upload the JSON file from test 4.1
3. Verify the imported process

**Expected:**
- Process is imported successfully
- All nodes and connections are recreated
- Metadata and tracking info are preserved

---

## 5. Node Configuration Edge Cases

### 5.1 Form Node with Multiple Field Types
**Steps:**
1. Create a new form node
2. Add fields of all types:
   - Text field
   - Email field
   - Number field
   - Date field
   - Select field with options: "Option 1", "Option 2", "Option 3"
   - Textarea field
3. Save configuration

**Expected:**
- All field types are supported
- Select field shows dropdown with options
- Date field shows date picker

### 5.2 Conditional Node Logic
**Steps:**
1. Add a "조건" (Conditional) node
2. Set condition: "if 승인 상태 = '승인됨'"
3. Add two branches: "승인됨" and "거부됨"
4. Connect different end paths for each branch

**Expected:**
- Conditional logic is saved
- Multiple output connections are supported
- Branch labels are displayed

---

## 6. Real-time Collaboration Features

### 6.1 Auto-save Functionality
**Steps:**
1. Create a new process
2. Add multiple nodes
3. Wait for 5 seconds without manually saving
4. Refresh the browser

**Expected:**
- Process is auto-saved
- All changes are preserved after refresh
- No data loss

---

## 7. UI/UX Edge Cases

### 7.1 Handle Long Process Names
**Steps:**
1. Create a process with name: "매우 긴 프로세스 이름 테스트용 프로세스 이름이 매우 길어서 UI가 깨지는지 확인하는 테스트입니다"
2. View the process in the process list

**Expected:**
- Process name is truncated with ellipsis
- Hover shows full name in tooltip
- UI layout is not broken

### 7.2 Handle Many Nodes on Canvas
**Steps:**
1. Create a process
2. Add 20+ nodes of various types
3. Connect them in a complex flow
4. Zoom in and out
5. Pan around the canvas

**Expected:**
- Canvas handles many nodes smoothly
- Zoom and pan work correctly
- Performance remains acceptable

---

## 8. Error Handling

### 8.1 Network Error During Save
**Steps:**
1. Open browser DevTools
2. Enable offline mode
3. Create a new process
4. Try to save

**Expected:**
- Error message: "네트워크 연결을 확인해주세요"
- Process data is retained locally
- User can retry after network is restored

### 8.2 Invalid Node Configuration
**Steps:**
1. Create a form node
2. Add a field with empty label
3. Try to save

**Expected:**
- Validation error: "필드 레이블을 입력해주세요"
- Configuration is not saved
- User can fix and retry
