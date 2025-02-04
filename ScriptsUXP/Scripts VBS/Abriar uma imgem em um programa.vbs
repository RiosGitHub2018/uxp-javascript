Dim imagePath, illustratorPath
imagePath = "C:\temp\fotos.jpg"
illustratorPath = "C:\Program Files\Adobe\Adobe Illustrator 2023\Support Files\Contents\Windows\Illustrator.exe"
' Abre a imagem no Adobe Illustrator
Set objShell = CreateObject("Wscript.Shell")
objShell.Run Chr(34) & illustratorPath & Chr(34) & " " & Chr(34) & imagePath & Chr(34)
