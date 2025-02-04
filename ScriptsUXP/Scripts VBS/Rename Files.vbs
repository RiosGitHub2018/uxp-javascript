On Error Resume Next
        'seu código aqui
        Set fso = CreateObject("Scripting.FileSystemObject")
        Set folder = fso.GetFolder("D:\Testes")

        For Each file In folder.Files
            ' Obtém o nome do arquivo e sua extensão
            fileName = fso.GetBaseName(file)
            fileExt = fso.GetExtensionName(file)

            ' Remove todos os caracteres não numéricos do nome do arquivo
            newFileName = ""
            For i = 1 To Len(fileName)
                If IsNumeric(Mid(fileName, i, 1)) Then
                    newFileName = newFileName & Mid(fileName, i, 1)
                End If
            Next

            ' Verifica se o novo nome do arquivo é um número entre 1 e 9 e adiciona um dígito "0" se necessário
            If Len(newFileName) = 1 And CInt(newFileName) >= 1 And CInt(newFileName) <= 9 Then
                newFileName = "0" & newFileName
            End If

            ' Adiciona o prefixo "Pag_" ao novo nome do arquivo
            newFileName = "Pag#0" & newFileName
            
            ' Renomeia o arquivo
            file.Name = newFileName & "." & fileExt
        Next

If Err.Number <> 0 Then
   ' código para lidar com o erro aqui
End If





