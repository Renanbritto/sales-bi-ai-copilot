@echo off
title RN Intelligence - Backend FastAPI
echo ========================================================
echo   Iniciando Backend RN Intelligence (FastAPI + BI)
echo ========================================================
echo.
cd /d "%~dp0backend"
call .\.venv\Scripts\activate.bat
python -m uvicorn app.main:app --reload --port 8000
pause
