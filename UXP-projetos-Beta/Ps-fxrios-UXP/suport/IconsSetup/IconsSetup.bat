@echo off
mode 20, 1

REM Verifica se o script está sendo executado como administrador
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"

REM Se o retorno do comando acima for 0, então o script está sendo executado como administrador
if %errorlevel%==0 (
    echo Script está sendo executado como administrador
) else (
    echo Script não está sendo executado como administrador - solicitando elevação de privilégios
    powershell.exe -Command "& { Start-Process '%0' -Verb RunAs }"
    exit /b
)

REM Obtém o caminho do diretório onde o script está localizado
set "ScriptDir=%~dp0"

REM Muda o diretório de trabalho para o diretório do script
cd /d "%ScriptDir%"

REM Agora, o diretório de trabalho é o mesmo do script, você pode executar o instalador
IconsSetup.exe /quiet



