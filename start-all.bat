@echo off
setlocal enabledelayedexpansion

:: Check for the JAR file in admin/target
cd /d "%~dp0admin"
set "ADMIN_JAR="
for %%f in (target\*.jar) do (
    echo %%f | findstr /v /i ".original" >nul
    if !errorlevel! == 0 (
        set "ADMIN_JAR=%%f"
    )
)

:: Return to root
cd /d "%~dp0"

echo [1/2] Starting Admin (Java JAR)...
if defined ADMIN_JAR (
    start "Admin Server" cmd /k "cd /d %~dp0admin && java -jar !ADMIN_JAR!"
) else (
    echo [ERROR] No JAR file found in admin/target/
    echo Please build the project first or check the target folder.
)

echo [2/2] Starting Client (bun start)...
start "Client Project" cmd /k "cd /d %~dp0client && bun start"

echo.
echo ==========================================
echo Admin and Client are starting in separate windows.
echo ==========================================
pause
