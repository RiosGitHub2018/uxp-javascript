Option Explicit
Dim WShell
' Aguarda alguns segundos para a janela abrir
Sub WaitSeconds(intSeconds)
    WScript.Sleep(intSeconds * 80)
End Sub
' Inicia o processo
Set WShell = CreateObject("WScript.Shell")
WShell.Run """C:\Program Files (x86)\Canon\IJ Scan Utility\SCANUTILITY.exe"""
' Aguarda a janela abrir
WaitSeconds(2)
' Tenta ativar a janela do IJ Scan Utility
WShell.AppActivate "Canon IJ Scan Utility"
WaitSeconds(1)
' Simula o clique no botão ScanGear
WShell.SendKeys "{TAB}"
WShell.SendKeys "{TAB}"
WShell.SendKeys "{TAB}"
WShell.SendKeys "{TAB}"
WShell.SendKeys "{TAB}"
WShell.SendKeys "{TAB}"
WShell.SendKeys "{TAB}"
WShell.SendKeys " "

Set WShell = Nothing