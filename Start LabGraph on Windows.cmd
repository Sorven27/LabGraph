@echo off
title LabGraph
powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -File "%~dp0windows_server.ps1" -Root "%~dp0"
if errorlevel 1 (
  echo.
  echo LabGraph could not be started.
  pause
)
