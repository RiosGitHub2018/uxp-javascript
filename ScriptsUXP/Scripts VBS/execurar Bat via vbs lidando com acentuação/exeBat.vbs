Set objShell = CreateObject("WScript.Shell")
Set objFSO = CreateObject("Scripting.FileSystemObject")
strScriptPath = objFSO.GetParentFolderName(WScript.ScriptFullName)
strBatchFile = "diretorio.bat"
strCommand = "cmd /c """ & strScriptPath & "\" & strBatchFile & """"
objShell.Run strCommand, 0, True