On Error Resume Next ' Ignora erros
Set WMI = GetObject("winmgmts:\\.\root\cimv2")
Set Processes = WMI.ExecQuery("SELECT * FROM Win32_Process WHERE Name = 'Hollywood Utility 1.0.exe'")

If Err.Number <> 0 Then
End If
If Processes.Count = 0 Then
Else
    For Each Process In Processes
        Process.Terminate()
        If Err.Number <> 0 Then

        End If
    Next
End If
