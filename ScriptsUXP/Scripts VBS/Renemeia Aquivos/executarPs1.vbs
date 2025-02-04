Set objShell = CreateObject("WScript.Shell")
objShell.Run "powershell.exe -ExecutionPolicy Bypass -File .\renameFilesC.ps1", 0
Set objShell = Nothing