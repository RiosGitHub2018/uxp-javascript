async function processTestes() {
      try {
          const valor = 7 // cm
          const camada = app.activeDocument.layers[0]
          const resolucao = app.activeDocument.resolution
          const largura = Number(valor)/2.54*resolucao
          const width =camada.bounds.width;
          const newWidth = largura*1*100/width;;
          await camada.scale( newWidth, newWidth)
        }
      catch (err) {alert(err)}
}