Option Explicit
On Error Resume Next
Dim objWMIService, objProcess, colProcess
Dim strComputer, strProcessName
Dim isRunning
strComputer = "."
strProcessName = "Roland VersaWorks.exe"
isRunning = False
Set objWMIService = GetObject("winmgmts:\\" & strComputer & "\root\cimv2")
Set colProcess = objWMIService.ExecQuery("Select * from Win32_Process Where Name = '" & strProcessName & "'")
For Each objProcess In colProcess
    isRunning = True
Next
If isRunning Then
Else
    Dim objShell
    Set objShell = CreateObject("WScript.Shell")
    objShell.Run """C:\Program Files (x86)\Roland VersaWorks\VersaWorks\Roland VersaWorks.exe""" 
    Set objShell = Nothing
End If