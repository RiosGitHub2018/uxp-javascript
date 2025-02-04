        camadaAtiva = app.activeDocument.activeLayers[0];
        if(camadaAtiva.kind==="group"){alert("Essa camada é uma camada de Grupo!")}
        else{ alert(`Essa camada é uma camada de ${camadaAtiva.kind}`)}