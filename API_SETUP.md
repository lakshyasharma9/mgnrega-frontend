# MGNREGA API Setup Instructions

## Getting Real Data from Government APIs

### Option 1: Data.gov.in API (Recommended)
1. Visit https://data.gov.in/
2. Register for an account
3. Navigate to MGNREGA datasets
4. Request API access and get your API key
5. Update your `.env` files with the API key:
   ```
   MGNREGA_API_KEY=your_actual_api_key_here
   ```

### Option 2: Direct MGNREGA Portal APIs
- Primary: https://nrega.nic.in/netnrega/api
- Secondary: https://mnregaweb4.nic.in/netnrega/api

### Current Configuration
The application is configured to:
1. **First**: Try to fetch real data from official APIs
2. **Fallback**: Use sample data for demonstration if API is unavailable

### Sample Data
When real API data is not available, the system uses sample data from:
- Alwar, Rajasthan
- Jaipur, Rajasthan  
- Udaipur, Rajasthan

### Testing the Setup
Run the sync command to test your API configuration:
```bash
npm run sync-real-data
```

### Notes
- Without a valid API key, the system will automatically use sample data
- The sample data is representative of real MGNREGA metrics
- All data structures match the official API format