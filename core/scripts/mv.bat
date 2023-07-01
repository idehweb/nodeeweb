@echo off

SET "SOURCE=%~1"
SET "DEST=%~2"
MOVE "%SOURCE%" "%DEST%"
exit "0"