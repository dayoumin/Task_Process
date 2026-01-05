# Admin Dashboard Usage Guide

## Installation

```bash
cd apps/dashboard
pnpm install
pnpm dev
```

Open http://localhost:5173

## Quick Test

1. Drag all 10 files from `samples/` folder into the upload zone
2. View automatic statistics dashboard
3. Try filters on the left sidebar
4. Export data using buttons in header

## Features

### Upload
- Drag & drop multiple ZIP files
- Each must contain progress.json
- View upload results with success/error counts

### Statistics
- 4 summary cards showing totals
- Department pie chart
- Process type bar chart
- Completion trend line chart
- Bottleneck analysis
- User performance table

### Filters
- Date range
- Department multi-select
- Process type multi-select  
- User multi-select
- Status (completed/in_progress/draft)

### Export
- Export Departments: CSV with department stats
- Export Users: CSV with user performance
- Export Report: Comprehensive CSV
- Print: Print-friendly layout

## Troubleshooting

### ZIP not uploading
- Ensure progress.json is at root level in ZIP
- Check file is actually a ZIP file (.zip extension)

### No statistics showing
- Upload at least one valid ZIP file
- Check filters are not excluding all data

### Charts empty
- Verify data has required fields (see progress.types.ts)
- Check browser console for errors

## Data Requirements

progress.json must have:
- id, processId, processName
- tracking object with departmentId, departmentName, processType, assignedTo, assignedToName
- status ("completed" for statistics)
- startedAt and completedAt (ISO-8601 format)
- stepProgress object with step details

See samples/ for working examples.
