async function suspendHistory(){
    await core.executeAsModal(async (executionContext) => {
        // await app.batchPlay([
        //     {"_obj":"reset","_target":[{"_property":"colors","_ref":"color"}]},
        //     {"_obj":"make","documentID":408,"new":{"_obj":"document","artboard":false,"autoPromoteBackgroundLayer":false,"depth":8,"fill":{"_enum":"fill","_value":"white"},"guides":[],"height":{"_unit":"pixelsUnit","_value":altura},"mode":{"_class":"RGBColorMode"},"name":nome,"pixelScaleFactor":1.0,"profile":"sRGB IEC61966-2.1","resolution":{"_unit":"densityUnit","_value":250.0},"width":{"_unit":"pixelsUnit","_value":largura}}}, {"_obj":"delete","_target":[{"_property":"currentHistoryState","_ref":"historyState"}]}
        // ])
    
        ////////////SUSPERDE HISTÓRICO: OBS: NESSE CASO, LOGO APÓS O DOCUMENTO SER ADICIONADO
        const hostControl = executionContext.hostControl
        const suspensionIDDuplication = await hostControl.suspendHistory({
            historyStateInfo: { name: opcao, target: [{ _ref: "document", _id: photoshop.app.activeDocument.id, }] }
        });

        //////// /MEUS SCRIPTS AQUI! :::::::::::::::::::::::::::

    
        /////////////////////////////////////////////////////////////
     },{"interactive": true});
}
