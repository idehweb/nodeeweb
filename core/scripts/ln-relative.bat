@echo off
setlocal enabledelayedexpansion

@REM  ln-relative.bat C:\app\public\files ..\front\index.html index.html

set "root=%~1"
set "src=%~2"
set "dist=%~3"

cd /d "%root%"

mklink "%dist%" "%src%"

exit /b 0