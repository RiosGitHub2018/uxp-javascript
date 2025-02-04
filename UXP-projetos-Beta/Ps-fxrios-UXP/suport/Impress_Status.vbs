Set objWMIService = GetObject("winmgmts:\\.\root\CIMV2")
Set colPrintJobs = objWMIService.ExecQuery("SELECT * FROM Win32_PrintJob")
' Crie uma variável para armazenar a saída no formato JavaScript
output = "const impressaoStatus = [" & vbCrLf
For Each objPrintJob In colPrintJobs
    ' Obtenha informações sobre o trabalho de impressão
    printerName = objPrintJob.Name
    documentName = objPrintJob.Document
    totalPages = objPrintJob.TotalPages
    status = objPrintJob.Status
    ' Tente determinar o número de cópias com base no total de páginas
    copies = 1  ' Padrão, uma cópia
    If totalPages > 1 Then
        copies = totalPages
    End If
    ' Adicione as informações ao formato JavaScript
    output = output & "  { Nome da Impressora: """ & printerName & """, Documento: """ & documentName & """, Paginas: """ & totalPages & """, Status: """ & status & """, Copias: """ & copies & """ }," & vbCrLf
Next
' Remova a vírgula no final da última entrada
output = Left(output, Len(output) - 3) & vbCrLf
' Adicione o fechamento do array
output = output & "];" & vbCrLf
' Crie o objeto FileSystem para salvar o arquivo .js
Set objFSO = CreateObject("Scripting.FileSystemObject")
' Caminho do arquivo .js na pasta C:\Temp
Dim filePath
filePath = "C:\Temp\impressao_status.json"
' Crie o arquivo .js e escreva os dados formatados nele
Set objFile = objFSO.CreateTextFile(filePath, True)
objFile.Write output
objFile.Close
' Exiba uma mensagem de confirmação
MsgBox "Os dados foram salvos em " & filePath
