# MGNREGA Dashboard - Real Data Configuration

## Overview
This dashboard now uses **ONLY REAL DATA** from official MGNREGA government APIs. All dummy/sample data has been removed.

## Data Sources
- **Primary**: Official MGNREGA Data Portal (https://api.data.gov.in)
- **Secondary**: MGNREGA NIC Portal APIs (https://nrega.nic.in)
- **Backup**: MGNREGA Web Portal (https://mnregaweb4.nic.in)

## Setup for Real Data

### 1. API Key Configuration
Get your API key from https://api.data.gov.in and update `.env`:
```
MGNREGA_API_KEY=your_actual_api_key_here
```

### 2. Sync Real Data
```bash
cd backend
npm run sync-real-data
```

### 3. Verify Data
The system will only display real MGNREGA data. If no real data is available, appropriate error messages will be shown.

## Data Integrity
- ✅ All dummy data removed
- ✅ Only official government APIs used
- ✅ Real-time data synchronization
- ✅ Error handling for missing data
- ✅ No fallback to fake data

## API Endpoints Used
1. **District Data**: `/resource/3b01bcb8-0b14-4abf-b6f2-c1bfd384ba69`
2. **Job Cards**: MGNREGA Portal API
3. **Work Allocations**: MGNREGA Portal API
4. **Payments**: MGNREGA Portal API
5. **Attendance**: MGNREGA Portal API

## Important Notes
- The dashboard will show "No data available" if real API data cannot be fetched
- This ensures complete transparency and authenticity of displayed information
- Regular data sync is recommended (every 24 hours)