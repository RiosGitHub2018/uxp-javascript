    async function ferramentaCorte(wSize, hSize){
            try {
                await core.executeAsModal( async() => {
                    resolucao = parseFloat(app.activeDocument.resolution);
                    wsDoc = parseFloat(app.activeDocument.width);
                    hsDoc = parseFloat(app.activeDocument.height);
                    larguraInput = parseFloat(wSize / 2.54 * resolucao);
                    alturasInput = parseFloat(hSize / 2.54 * resolucao);

                    proporcao = hsDoc/ alturasInput;;
                    larguraBase = larguraInput * proporcao;
                    
                    if(wsDoc > larguraBase ){ enquadraCorteHC() }
                    else{ enquadraCorteWC() }
 
                    function enquadraCorteHC(){
                            alturaInicial = parseFloat(app.activeDocument.height);
                            proporcao = alturaInicial / alturasInput;
                            larguraInicial = larguraInput * proporcao;
                            wSobra = parseFloat(wsDoc - larguraInicial)/2;
                            hSobra = parseFloat(hsDoc - alturaInicial)/2;
                            left = parseFloat(wSobra);
                            top = parseFloat(0);
                            right = parseFloat(larguraInicial + wSobra);
                            bottom = parseFloat(alturaInicial);
                     }

                     function enquadraCorteWC(){
                            larguraInicial = parseFloat(app.activeDocument.width);
                            proporcao = larguraInicial / larguraInput;
                            alturaInicial = alturasInput * proporcao;
                            wSobra = parseFloat(wsDoc - larguraInicial)/2;
                            hSobra = parseFloat(hsDoc - alturaInicial)/2;
                            left = parseFloat(0);
                            top = parseFloat(hSobra);
                            right = parseFloat(larguraInicial);
                            bottom = parseFloat(alturaInicial + hSobra);
                     }

                    larguraFinal = parseFloat(wSize * 72/2.54);
                    alturaxFinal = parseFloat(hSize * 72/2.54);
               
                    await app.batchPlay([ 
                            await app.batchPlay([ 
                            {"descriptor": {"AutoFillMethod":1,"_obj":"crop","angle":{"_unit":"angleUnit","_value":0.0},"cropAspectRatioModeKey":{"_enum":"cropAspectRatioModeClass","_value":"targetSize"},"cropFillMode":{"_enum":"cropFillMode","_value":"defaultFill"},"delete":true,"to":{"_obj":"rectangle","bottom":{"_unit":"pixelsUnit","_value":bottom},"left":{"_unit":"pixelsUnit","_value":left},"right":{"_unit":"pixelsUnit","_value":right},"top":{"_unit":"pixelsUnit","_value":top}}}, "options": {"dialogOptions": "display"}},
                            {"_obj":"imageSize","width":{"_unit":"distanceUnit","_value": larguraFinal}},{"_obj":"imageSize","height":{"_unit":"distanceUnit","_value":alturaxFinal},"interfaceIconFrameDimmed":{"_enum":"interpolationType","_value":"automaticInterpolation"}}
                        ])
                    ]);
                },{"interactive": true});
            } catch (error) {}
       }