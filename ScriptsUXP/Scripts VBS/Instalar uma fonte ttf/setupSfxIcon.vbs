
Set objShell = CreateObject("WScript.Shell")

' Nome do arquivo de fonte (sem caminho completo)
fontFileName = "UXPSfxIcon.ttf"

' Nome da fonte (sem extensão)
fontName = "UXPSfxIcon"

' Construa o caminho completo
fontPath = objShell.CurrentDirectory & "\" & fontFileName

' Instala a fonte
InstallFont objShell, fontPath, fontName

Sub InstallFont(objShell, fontPath, fontName)
' Cria um objeto para o registro do Windows
Set objReg = GetObject("winmgmts:\\.\root\default:StdRegProv")
' Define a chave do Registro para a instalação de fontes
fontKey = "SOFTWARE\Microsoft\Windows NT\CurrentVersion\Fonts"
' Adiciona a fonte ao Registro
objReg.GetStringValue &H80000001, fontKey, fontName, fontValue
If IsNull(fontValue) Then
objReg.CreateKey &H80000001, fontKey
objReg.SetStringValue &H80000001, fontKey, fontName, fontPath
End If
' Atualiza as informações de fonte do sistema
objShell.Run "cmd /c echo y | " & "copy " & Chr(34) & fontPath & Chr(34) & " %windir%\Fonts\", 0, True
End Sub