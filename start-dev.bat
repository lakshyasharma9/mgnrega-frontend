@echo off
echo Starting MGNREGA Dashboard Development Environment...

echo Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo Starting backend server...
start "Backend Server" cmd /k "npm run dev"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

cd ..
echo Starting frontend development server...
start "Frontend Server" cmd /k "npm run dev"

echo Both servers are starting...
echo Frontend: http://localhost:5173
echo Backend: http://localhost:3001
pause