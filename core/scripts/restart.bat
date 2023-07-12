@echo off

SET "SITE=%~1"
pm2 "restart" "%SITE%"
exit "0"