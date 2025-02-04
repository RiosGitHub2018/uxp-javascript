' Const FONTS = &H14&
' Set objShell = CreateObject("Shell.Application")
' Set objFolder = objShell.Namespace(FONTS)
' objFolder.CopyHere "C:\Users\Cliente\Desktop\Scripts\UXPSfxIcon.ttf"
Const FONTS = &H14&
Set objShell = CreateObject("Shell.Application")
Set objFolder = objShell.Namespace(FONTS)
' Obter o caminho do diretório onde o script VBS está localizado
strScriptPath = Replace(WScript.ScriptFullName, WScript.ScriptName, "")
' Construir o caminho de destino para a cópia do arquivo
strDestination = strScriptPath & "UXPSfxIcon.ttf"
' Realizar a cópia do arquivo
objFolder.CopyHere strDestination