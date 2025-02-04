Set WshShell = CreateObject("WScript.Shell")
' Nome da impressora
printerName = "EPSON L1300 Series"
' Comando para abrir as preferências de impressão
command = "rundll32 printui.dll,PrintUIEntry /e /n """ & printerName & """"
' Executa o comando
WshShell.Run command, 1, False
' Espera a janela abrir (ajuste este valor se necessário)
WScript.Sleep 200
' Simula pressionar Ctrl+Tab duas vezes para chegar à aba Manutenção
WshShell.SendKeys "^{TAB}"
WScript.Sleep 100
WshShell.SendKeys "^{TAB}"

Set WshShell = Nothing