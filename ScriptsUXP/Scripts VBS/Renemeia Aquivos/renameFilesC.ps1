# Adiciona o marcador BOM UTF-8 ao início do script
[byte[]] $bom = 0xEF, 0xBB, 0xBF
# [System.IO.File]::WriteAllBytes("SeuScript.ps1", $bom)
# Restante do seu script começa aqui
$diretorio = "C:\Users\Pichau\Meu Drive\_Projetos em andamento\Ano 2023\Album\TestandoAcentuação"
$prefixo = "Pag_"
$contador = 1
# Obtém a lista de arquivos no diretório
$listaOrdenada = Get-ChildItem -Path $diretorio | Sort-Object { [int]($_.BaseName -replace '[^\d]') }
# Itera sobre cada arquivo na lista ordenada
foreach ($arquivo in $listaOrdenada) {
    $numero = "{0:D2}" -f $contador
    $novoNome = "$prefixo$numero$($arquivo.Extension)"
    # Constrói o novo caminho considerando caracteres especiais
    $caminhoNovoNome = Join-Path -Path $diretorio -ChildPath $novoNome
    # Renomeia o arquivo
    Move-Item -Path $arquivo.FullName -Destination $caminhoNovoNome
    $contador++
}

Write-Host "Renomeação concluída."
