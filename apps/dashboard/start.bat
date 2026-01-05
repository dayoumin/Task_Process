@echo off
echo ========================================
echo  Admin Dashboard - Business Process Analytics
echo ========================================
echo.
echo Installing dependencies...
call npm install
echo.
echo Starting development server...
echo Open your browser to: http://localhost:5173
echo.
call npm run dev
