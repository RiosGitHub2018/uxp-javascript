@echo off
cd %~dp0
cd Instal

start /wait msiexec.exe /i "UXPSfxIcon.msi" /qb