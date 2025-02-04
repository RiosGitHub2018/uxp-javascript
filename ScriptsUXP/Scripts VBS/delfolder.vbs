Dim objFSO
Set objFSO = CreateObject("Scripting.FileSystemObject")

' Verifica se a pasta existe
If objFSO.FolderExists("C:\temp") Then
    ' Remove a pasta
    objFSO.DeleteFolder("C:\temp")
    WScript.Echo "A pasta C:\temp foi excluída com sucesso."
Else
    WScript.Echo "A pasta C:\temp não existe."
End If

Set objFSO = Nothing