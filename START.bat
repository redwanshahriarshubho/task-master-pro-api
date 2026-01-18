@echo off
echo ========================================
echo   Task Master Pro - Quick Start
echo ========================================
echo.

echo Checking if node_modules exists...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting backend server...
start "Backend Server" cmd /k "npm run server"

timeout /t 3 /nobreak > nul

echo Starting frontend...
start "Frontend Dev Server" cmd /k "npm run dev"

echo.
echo ========================================
echo   Both servers are starting!
echo   Backend: http://localhost:3001
echo   Frontend: http://localhost:5173
echo ========================================
echo.
echo Press any key to open the app in browser...
pause > nul

start http://localhost:5173

echo.
echo To stop the servers, close both command windows.
echo.
