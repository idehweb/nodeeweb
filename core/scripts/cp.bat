@echo off

SET "SOURCE=%~1"
SET "DEST=%~2"
DEL /S /Q "%DEST%" && robocopy  "%SOURCE%" "%DEST%" /E /NFL /NDL /NJH /NJS /nc /ns /np

EXIT /B