On Error Resume Next
Set objFSO = CreateObject("Scripting.FileSystemObject")
objFSO.DeleteFolder "C:\temp", True
If Err.Number <> 0 Then
    'WScript.Echo "Ocorreu um erro ao excluir a pasta: " & Err.Description
End If
On Error GoTo 0