@REM @echo off
@REM chcp 65001
@REM "diretorio=C:\Users\Pichau\Meu Drive\_Projetos em andamento\Ano 2023\Album\TestandoAcentuação"

@echo off
chcp 65001
setlocal enabledelayedexpansion

set "diretorio=C:\Users\Pichau\Meu Drive\_Projetos em andamento\Ano 2023\Album\TestandoAcentuação"
set "prefixo=Pag_"
set "contador=1"

cd "%diretorio%" || exit /b

rem Criar lista ordenada de arquivos
for %%f in (*) do (
    set "arquivos[!contador!]=%%f"
    set /a contador+=1
)

rem Ordenar a lista
for /l %%i in (1,1,%contador%) do (
    for /l %%j in (%%i,1,%contador%) do (
        set "temp=!arquivos[%%i]!"
        set "arquivos[%%i]=!arquivos[%%j]!"
        set "arquivos[%%j]=!temp!"
    )
)

rem Renomear os arquivos
set "contador=1"
for %%f in (%arquivos%) do (
    set "numero=!contador!"
    if !contador! lss 10 set "numero=00!contador!"
    if !contador! geq 10 if !contador! lss 100 set "numero=0!contador!"

    ren "%%f" "!prefixo!!numero!%%~xf"
    set /a contador+=1
)

echo Renomeação concluída.

