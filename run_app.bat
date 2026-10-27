@echo off
TITLE Computer Networks 16-Mark Study Guide
COLOR 0A
echo.
echo  ============================================================
echo    CN Study Guide — 16-Mark Exam Answer Engine
echo    Vite + React + PWA + Offline Mode
echo  ============================================================
echo.

:: Change to the directory of this batch file
cd /d "%~dp0"

:: ─── Check Node.js ──────────────────────────────────────────
where node >nul 2>&1
if errorlevel 1 (
    echo  [ERROR] Node.js not found. Install from https://nodejs.org/
    echo  Press any key to exit...
    pause >nul
    exit /b 1
)

:: ─── Install dependencies if missing ────────────────────────
if not exist node_modules (
    echo  [INFO] Installing dependencies — this runs only once...
    call npm install --silent
    if errorlevel 1 (
        echo  [ERROR] npm install failed. Check your internet connection.
        pause >nul
        exit /b 1
    )
    echo  [OK] Dependencies installed.
    echo.
)

:: ─── Choose mode ────────────────────────────────────────────
echo  Choose a launch mode:
echo.
echo    [1] Preview Mode  (Production build, faster, for study use)
echo    [2] Dev Mode      (Hot-reload, for development use)
echo.
set /p CHOICE="  Enter 1 or 2 (default = 1): "

if "%CHOICE%"=="2" goto DEVMODE

:: ─── Preview Mode (Default) ─────────────────────────────────
:PREVIEWMODE
echo.
echo  [INFO] Building latest production bundle...
call npm run build 2>&1
if errorlevel 1 (
    echo.
    echo  [ERROR] Build failed! See errors above.
    pause >nul
    exit /b 1
)
echo.
echo  ============================================================
echo    Server running at: http://localhost:4173/
echo    Press Ctrl+C to stop the server.
echo  ============================================================
echo.
:: Open browser automatically after 1.5 seconds
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:4173/"
call npm run preview -- --port 4173 --host
goto END

:: ─── Dev Mode ────────────────────────────────────────────────
:DEVMODE
echo.
echo  ============================================================
echo    Dev server running at: http://localhost:5173/
echo    Press Ctrl+C to stop the server.
echo  ============================================================
echo.
:: Open browser automatically after 1.5 seconds
start "" cmd /c "timeout /t 2 /nobreak >nul && start http://localhost:5173/"
call npm run dev -- --host
goto END

:END
echo.
echo  Server stopped. Press any key to close.
pause >nul
