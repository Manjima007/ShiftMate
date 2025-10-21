@echo off
title ShiftMate AI Service
color 0A

echo ===================================================
echo        ShiftMate AI Service Server
echo ===================================================
echo.
echo Starting server on http://127.0.0.1:8000
echo API Docs at http://127.0.0.1:8000/docs
echo.
echo Press Ctrl+C to stop
echo ===================================================
echo.

cd /d "%~dp0"

REM Kill any existing Python servers
taskkill /F /IM python.exe 2>nul
taskkill /F /IM pythonw.exe 2>nul

REM Wait a second
timeout /t 2 /nobreak >nul

REM Start server
echo Starting AI service...
venv\Scripts\python.exe run_server.py

pause
