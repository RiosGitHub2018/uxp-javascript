try{
    
    // @target illustrator
// Script para processar múltiplos arquivos .ai e exportar como SVG

// Solicita ao usuário que selecione a pasta com os arquivos .ai
var inputFolder = Folder.selectDialog("Selecione a pasta com os arquivos .AI");
if (inputFolder == null) {
    alert("Nenhuma pasta selecionada. O script será encerrado.");
    exit();
}

// Função para adicionar zeros à esquerda
function padNumber(num) {
    return ('000' + num).slice(-3);
}

// Função para ajustar o documento ao artwork
function fitArtworkToDocument(doc) {
    try {
        // Seleciona todos os objetos
        doc.selectObjectsOnActiveArtboard();
        
        // Se houver objetos selecionados
        if (doc.selection.length > 0) {
            // Fit to Artwork Bounds
            doc.fitArtboardToSelectedArt(0);
        }
        
        // Remove a seleção
        doc.selection = null;
    } catch(e) {
        alert("Erro ao ajustar artwork: " + e);
    }
}

// Obtém todos os arquivos .ai da pasta
var aiFiles = inputFolder.getFiles("*.ai");
var counter = 1;
var sucessCount = 0;
var errorCount = 0;

// Processa cada arquivo
for (var i = 0; i < aiFiles.length; i++) {
    try {
        // Abre o arquivo .ai
        var doc = app.open(aiFiles[i]);
        
        // Aplica Fit to Artwork Bounds
        fitArtworkToDocument(doc);
        
        // Define o nome do arquivo SVG
        var svgFile = new File(inputFolder + "/icon" + padNumber(counter) + ".svg");
        
        // Configurações básicas de exportação SVG
        var exportOptions = new ExportOptionsSVG();
        
        // Exporta como SVG
        doc.exportFile(svgFile, ExportType.SVG, exportOptions);
        
        // Fecha o documento sem salvar alterações
        doc.close(SaveOptions.DONOTSAVECHANGES);
        
        // Incrementa contadores
        counter++;
        sucessCount++;
        
    } catch(e) {
        errorCount++;
        alert("Erro ao processar " + aiFiles[i].name + "\nErro: " + e);
    }
}

// Relatório final
alert("Processo concluído!\n" + 
      "Arquivos processados com sucesso: " + sucessCount + "\n" +
      "Arquivos com erro: " + errorCount);
    
}catch(e){alert(e)}