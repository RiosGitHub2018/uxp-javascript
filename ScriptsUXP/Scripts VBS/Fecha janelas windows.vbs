'Set objShell = WScript.CreateObject("Shell.Application")
'Set objWindows = objShell.Windows
'For Each objWindow in objWindows
   ' objWindow.Quit
'Next

'//////////// Opção 2
On Error Resume Next

Set objShell = WScript.CreateObject("Shell.Application")
Set objWindows = objShell.Windows

For Each objWindow in objWindows
  If InStr(1, objWindow.FullName, "explorer.exe", vbTextCompare) > 0 Then
    objWindow.Quit
  End If
Next
	
If Err.Number <> 0 Then
' código para lidar com o erro aqui
End If


