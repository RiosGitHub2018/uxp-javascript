' Cria um objeto para acessar informações do sistema
Set objNetwork = CreateObject("WScript.Network")
' Obtém o nome do usuário atualmente logado
username = objNetwork.UserName
' Define o caminho do diretório e do arquivo de texto
directoryPath = "C:\temp"
filePath = directoryPath & "\UserName.txt"
' Cria um objeto para manipular arquivos de texto
Set objFSO = CreateObject("Scripting.FileSystemObject")
' Verifica se o diretório existe, se não, cria o diretório
If Not objFSO.FolderExists(directoryPath) Then
    objFSO.CreateFolder(directoryPath)
End If
' Cria o arquivo de texto e escreve o nome de usuário nele
Set objFile = objFSO.CreateTextFile(filePath, True)
objFile.Write username
' Fecha o arquivo
objFile.Close
