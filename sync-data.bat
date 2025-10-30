@echo off
echo Syncing MGNREGA API data...
cd backend
npm run sync-data
echo.
echo Data sync completed!
pause