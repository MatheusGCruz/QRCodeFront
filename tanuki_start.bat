@echo off
SETLOCAL

:: Navigate to the project directory (if needed)
::cd /d "%~dp0"

:: Start the Node.js server
npm start

:: Keep the command prompt open
pause
