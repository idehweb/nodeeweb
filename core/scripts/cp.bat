@echo off

SET "SOURCE=%~1"
SET "DEST=%~2"
DEL /S /Q "%DEST%" && xcopy /y /s /q  "%SOURCE%" "%DEST%"