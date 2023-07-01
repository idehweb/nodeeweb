@echo off

SET "URL=%~1"
wget "%URL%"
exit "0"