Option Explicit

Dim shell,oWindows,j

Set shell = CreateObject("Shell.Application")

Set oWindows = shell.windows

for j = oWindows.count - 1 to 0 Step -1

    oWindows.item(j).quit
    Wscript.Sleep 50

next

set shell = nothing

set oWindows = nothing