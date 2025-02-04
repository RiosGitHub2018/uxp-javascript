Set WshShell = CreateObject("WScript.Shell" ) 
WshShell.Run "cmd /c C:/temp/{987-321-654}.bat", 0, True
Set WshShell = Nothing