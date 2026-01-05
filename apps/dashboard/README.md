# Admin Dashboard - Business Process Analytics

Analytics dashboard for analyzing business process execution statistics.

## Quick Start

```bash
# 루트에서 전체 설치 (권장)
pnpm install

# 개발 서버 실행
pnpm dev
```

Open http://localhost:5173

## Features

- Upload multiple ZIP files with progress.json
- Department, process type, and user statistics
- Interactive charts (Pie, Bar, Line, Horizontal Bar)
- Filters by date, department, process type, user, status
- Export to CSV (departments, users, comprehensive report)
- Print-friendly layout

## Sample Data

10 sample ZIP files in `samples/` directory for testing.

## Data Format

ZIP files must contain `progress.json` with structure:

```json
{
  "id": "PROG-xxx",
  "processId": "PROC-xxx",
  "processName": "Process Name",
  "tracking": { ... },
  "status": "completed",
  "startedAt": "ISO-8601",
  "completedAt": "ISO-8601",
  "stepProgress": { ... }
}
```

See full README in project for detailed documentation.
