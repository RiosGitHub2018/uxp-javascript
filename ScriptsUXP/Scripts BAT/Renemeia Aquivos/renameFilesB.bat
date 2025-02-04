@echo off
chcp 65001
setlocal enabledelayedexpansion
set "diretorio=Y:\Albuns Loja\Albuns 2017\M. 02.2017\Aureliano\Batizado Yasmine"
set "caminhoScript=C:\Users\Pichau\Desktop\Scripts\renameFilesC.ps1"
cd "%diretorio%" || exit /b
powershell.exe -ExecutionPolicy Bypass -File "%caminhoScript%"
@REM echo Renomeação concluída.