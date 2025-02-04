const app = require("photoshop").app;
const action = require("photoshop").action;
const core = require("photoshop").core;
const alert = app.showAlert;


try {
                document.addEventListener('DOMContentLoaded', async function () {
                    const progressBar = document.getElementById('progress-bar');
                


                    function evento() { setTimeout( async() =>  {

                        async function processarEvento1() {
                            // Processamento do evento 1
                          // alert("")
                            await core.executeAsModal(async () => {
                                await app.batchPlay([{"_obj":"imageSize","constrainProportions":true,"interfaceIconFrameDimmed":{"_enum":"interpolationType","_value":"automaticInterpolation"},"resolution":{"_unit":"densityUnit","_value":800.0},"scaleStyles":true}])
                                await updateProgressBar(20);
                            })
                    
                            // Atualização da barra de progresso
                        
                        }
                    
                    async function processarEvento2() {
                            // Processamento do evento 2
                            // ...
                           // alert("")
                            await core.executeAsModal(async () => {
                                await app.batchPlay([{"_obj":"imageSize","constrainProportions":true,"interfaceIconFrameDimmed":{"_enum":"interpolationType","_value":"automaticInterpolation"},"resolution":{"_unit":"densityUnit","_value":1000.0},"scaleStyles":true}])
                                await updateProgressBar(40);
                            })
                            // Atualização da barra de progresso
                        
                        }
                    
                        async function processarEvento3() {
                            // Processamento do evento 3
                         //   alert("")
                            await core.executeAsModal(async () => {
                                await app.batchPlay([{"_obj":"imageSize","constrainProportions":true,"interfaceIconFrameDimmed":{"_enum":"interpolationType","_value":"automaticInterpolation"},"resolution":{"_unit":"densityUnit","_value":9200.0},"scaleStyles":true}])
                                await  updateProgressBar(60);
                                
                            })
                    
                            // Atualização da barra de progresso
                      
                        }
                    
                        async function processarEvento4() {
                            // Processamento do evento 4
                           // alert("")
                            await core.executeAsModal(async () => {
                                await app.batchPlay([{"_obj":"imageSize","constrainProportions":true,"interfaceIconFrameDimmed":{"_enum":"interpolationType","_value":"automaticInterpolation"},"resolution":{"_unit":"densityUnit","_value":600.0},"scaleStyles":true}])
                                await updateProgressBar(80);
                            })
                    
                            // Atualização da barra de progresso
                          
                        }
                    
                        async function processarEvento5() {
                            // Processamento do evento 5
                           // alert("")
                            await core.executeAsModal(async () => {
                                await app.batchPlay([{"_obj":"imageSize","constrainProportions":true,"interfaceIconFrameDimmed":{"_enum":"interpolationType","_value":"automaticInterpolation"},"resolution":{"_unit":"densityUnit","_value":700.0},"scaleStyles":true}])
                                await  updateProgressBar(100);
                            })
                    
                            // Atualização da barra de progresso para 100% no final
                         
                        }


                        
                   
                
                   async  function updateProgressBar(percentage) {
                    progressBar.style.width = percentage + '%';
                }
            
                // Chame suas funções de processamento de eventos aqui


                
                await  processarEvento1();
                await  processarEvento2();
                await processarEvento3();
                await processarEvento4();
                await processarEvento5();

                    });} setTimeout(evento, 1000);


                });

} catch (e) {alert(e)}
