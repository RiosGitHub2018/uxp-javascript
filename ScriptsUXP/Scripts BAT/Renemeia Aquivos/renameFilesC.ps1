$diretorio = "${path}"
$prefixo = "Pag_"
$contador = 1
cd $diretorio
# Obter a lista de arquivos ordenados numericamente
$listaOrdenada = Get-ChildItem | Sort-Object { [int]($_.BaseName -replace '[^\d]') }
foreach ($arquivo in $listaOrdenada) {
$numero = "{0:D3}" -f $contador
$novoNome = "$prefixo$numero$($arquivo.Extension)"
Rename-Item -Path $arquivo.FullName -NewName $novoNome
$contador++
}


