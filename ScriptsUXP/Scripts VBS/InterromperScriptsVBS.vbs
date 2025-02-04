Option Explicit
Sub KillWScriptProcesses()
    Dim objWMIService, colProcesses, objProcess
    Set objWMIService = GetObject("winmgmts:\\.\root\cimv2")
    Set colProcesses = objWMIService.ExecQuery("Select * from Win32_Process Where Name = 'wscript.exe'")
    For Each objProcess In colProcesses
        objProcess.Terminate()
        ' WScript.Echo "Terminated process with PID: " & objProcess.ProcessId
    Next
    Set colProcesses = Nothing
    Set objWMIService = Nothing
End Sub
KillWScriptProcesses