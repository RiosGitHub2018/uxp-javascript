@echo off
reg query "HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Fonts" | find "PSfxIcons (TrueType)" > nul
if %errorlevel% equ 0 (
   echo const fonteExiste = true; > ResulFont.txt
) else (
   echo const fonteExiste = false;> ResulFont.txt
)