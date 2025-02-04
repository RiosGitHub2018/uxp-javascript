' On Error Resume Next
' Set objFSO = CreateObject("Scripting.FileSystemObject")
' Set objShell = CreateObject("WScript.Shell")
' strFolder = "C:\Users\Pichau\Documents"
' strPhotoshop = "C:\Program Files\Adobe\Adobe Photoshop 2025\Photoshop.exe"

' Function IsImageFile(fileName)
'     ext = LCase(objFSO.GetExtensionName(fileName))
'     IsImageFile = (ext = "jpg") Or (ext = "jpeg") Or (ext = "png") Or (ext = "tif") Or (ext = "tiff")
' End Function

' Set objWMIService = GetObject("winmgmts:\\.\root\cimv2")
' strQuery = "SELECT * FROM __InstanceCreationEvent WITHIN 1 WHERE " & _
'            "TargetInstance ISA 'CIM_DirectoryContainsFile' AND " & _
'            "TargetInstance.GroupComponent=""Win32_Directory.Name='" & Replace(strFolder, "\", "\\") & "'"""

' Set colMonitoredEvents = objWMIService.ExecNotificationQuery(strQuery)

' Do While True
'     Set objLatestEvent = colMonitoredEvents.NextEvent
'     filePath = Mid(objLatestEvent.TargetInstance.PartComponent, InStr(objLatestEvent.TargetInstance.PartComponent, "=") + 1)
'     filePath = Replace(Replace(filePath, """", ""), "\\", "\")
    
'     If IsImageFile(filePath) Then
'         cmdLine = """" & strPhotoshop & """ """ & filePath & """"
'         objShell.Run cmdLine, 1, False
'         MsgBox "Arquivo detectado: " & filePath, vbInformation
'     End If
' Loop


' On Error Resume Next
' Set objFSO = CreateObject("Scripting.FileSystemObject")
' Set objShell = CreateObject("WScript.Shell")
' Set processedFiles = CreateObject("Scripting.Dictionary")
' strFolder = "C:\Users\Pichau\Documents"
' strPhotoshop = "C:\Program Files\Adobe\Adobe Photoshop 2025\Photoshop.exe"

' Function IsImageFile(fileName)
'     ext = LCase(objFSO.GetExtensionName(fileName))
'     IsImageFile = (ext = "jpg") Or (ext = "jpeg") Or (ext = "png") Or (ext = "tif") Or (ext = "tiff")
' End Function

' Set objWMIService = GetObject("winmgmts:\\.\root\cimv2")
' strQuery = "SELECT * FROM __InstanceCreationEvent WITHIN 1 WHERE " & _
'            "TargetInstance ISA 'CIM_DirectoryContainsFile' AND " & _
'            "TargetInstance.GroupComponent=""Win32_Directory.Name='" & Replace(strFolder, "\", "\\") & "'"""

' Set colMonitoredEvents = objWMIService.ExecNotificationQuery(strQuery)

' Do While True
'     Set objLatestEvent = colMonitoredEvents.NextEvent
'     filePath = Mid(objLatestEvent.TargetInstance.PartComponent, InStr(objLatestEvent.TargetInstance.PartComponent, "=") + 1)
'     filePath = Replace(Replace(filePath, """", ""), "\\", "\")
    
'     If IsImageFile(filePath) And Not processedFiles.Exists(filePath) Then
'         cmdLine = """" & strPhotoshop & """ """ & filePath & """"
'         objShell.Run cmdLine, 1, False
'         processedFiles.Add filePath, Now
'     End If
' Loop

On Error Resume Next
Set objFSO = CreateObject("Scripting.FileSystemObject")
Set objShell = CreateObject("WScript.Shell")
Set processedFiles = CreateObject("Scripting.Dictionary")
strFolder = "C:\Users\Pichau\Documents"
strPhotoshop = "C:\Program Files\Adobe\Adobe Photoshop 2025\Photoshop.exe"

' Definir o caminho base para a nova pasta
strBasePath = "C:\Users\Pichau\Desktop\Novas_Imagens"

Function IsImageFile(fileName)
    ext = LCase(objFSO.GetExtensionName(fileName))
    IsImageFile = (ext = "jpg") Or (ext = "jpeg") Or (ext = "png") Or (ext = "tif") Or (ext = "tiff")
End Function

Set objWMIService = GetObject("winmgmts:\\.\root\cimv2")
strQuery = "SELECT * FROM __InstanceCreationEvent WITHIN 1 WHERE " & _
           "TargetInstance ISA 'CIM_DirectoryContainsFile' AND " & _
           "TargetInstance.GroupComponent=""Win32_Directory.Name='" & Replace(strFolder, "\", "\\") & "'"""

Set colMonitoredEvents = objWMIService.ExecNotificationQuery(strQuery)

Dim newFolderCreated
newFolderCreated = False
Dim strNewFolderPath

Do While True
    Set objLatestEvent = colMonitoredEvents.NextEvent
    filePath = Mid(objLatestEvent.TargetInstance.PartComponent, InStr(objLatestEvent.TargetInstance.PartComponent, "=") + 1)
    filePath = Replace(Replace(filePath, """", ""), "\\", "\")
    
    If IsImageFile(filePath) And Not processedFiles.Exists(filePath) Then
        If Not newFolderCreated Then
            strNewFolderPath = strBasePath 
            ' Criar a nova pasta
            If Not objFSO.FolderExists(strNewFolderPath) Then
                objFSO.CreateFolder(strNewFolderPath)
            End If

            newFolderCreated = True
        End If
        ' Mover o arquivo para a nova pasta
        newFilePath = strNewFolderPath & "\" & objFSO.GetFileName(filePath)
        objFSO.MoveFile filePath, newFilePath
        ' Abrir o arquivo no Photoshop
        cmdLine = """" & strPhotoshop & """ """ & newFilePath & """"
        objShell.Run cmdLine, 1, False
        
        processedFiles.Add newFilePath, Now
    End If
Loop