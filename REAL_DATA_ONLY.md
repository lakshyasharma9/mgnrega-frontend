# MGNREGA Dashboard - Real Data Configuration

## Overview
This dashboard now exclusively uses **real-time data** from the official MGNREGA API. All mock/sample data has been removed.

## Data Source
- **Primary**: Official MGNREGA API (api.data.gov.in)
- **Location**: Google Maps API for location detection
- **No Fallbacks**: No mock or sample data is used

## Setup Instructions

### 1. Sync Real Data
Before using the dashboard, you must sync data from the MGNREGA API:

```bash
# Option 1: Use the batch script
sync-data.bat

# Option 2: Manual sync
cd backend
npm run sync-data
```

### 2. API Configuration
Ensure your `.env.backend` file has the correct API credentials:

```env
MGNREGA_API_KEY=579b464db66ec23bdd0000019f175bb5fd024b3c6c77aae432cc03c9
MGNREGA_API_BASE_URL=https://api.data.gov.in
GOOGLE_MAPS_API_KEY=AIzaSyCAChGbhY2X-BOBDzd2b37QXCRNCMxWwT8
```

### 3. Manual Sync via API
You can also trigger data sync via the API endpoint:

```bash
POST http://localhost:5001/api/sync
```

## Important Notes

- **No Mock Data**: The system will not work without real API data
- **API Dependency**: If the MGNREGA API is down, the dashboard will show errors
- **Data Freshness**: Run sync periodically to get latest data
- **Error Handling**: Clear error messages guide users to sync data when needed

## Troubleshooting

### "No districts found" Error
1. Run `sync-data.bat` or `npm run sync-data`
2. Check API key validity
3. Verify internet connectivity

### Location Detection Issues
1. Ensure Google Maps API key is valid
2. Check browser location permissions
3. Verify API key has Geocoding API enabled

### API Sync Failures
1. Verify MGNREGA API key is active
2. Check network connectivity
3. Review backend logs for detailed errors

## Data Structure
The system fetches and processes:
- District names and codes
- State information
- Total workers and wages
- Employment days
- Work completion statistics
- Budget utilization metrics