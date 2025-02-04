On Error Resume Next
Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objShell = CreateObject("WScript.Shell")

strFolder =  "C:\Users\Pichau\Documents" 'Altere para o caminho da pasta desejada

Set objFolder = objFSO.GetFolder(strFolder)
Set objWMIService = GetObject("winmgmts:\\.\root\cimv2")

If Err.Number <> 0 Then
    WScript.Echo "Erro ao acessar pasta: " & Err.Description
    WScript.Quit
End If

strQuery = "SELECT * FROM __InstanceCreationEvent WITHIN 1 WHERE " & _
           "TargetInstance ISA 'CIM_DirectoryContainsFile' AND " & _
           "TargetInstance.GroupComponent=""Win32_Directory.Name='" & Replace(strFolder, "\", "\\") & "'"""

Set colMonitoredEvents = objWMIService.ExecNotificationQuery(strQuery)

Do While True
    Set objLatestEvent = colMonitoredEvents.NextEvent
    MsgBox "Novo arquivo detectado!", vbInformation
Loop