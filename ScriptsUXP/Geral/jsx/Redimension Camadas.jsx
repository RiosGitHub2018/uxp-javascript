 function enquandrar_Cont(m) {
     BD = activeDocument.guides;
     Btn = BD[3].coordinate;
     Rig = BD[1].coordinate;
     Top = BD[2].coordinate;
     Left = BD[0].coordinate;
     var LB = activeDocument.activeLayer.bounds;
     if (m == 1) {
         var ConfigHV = Rig - Left;
         var O = LB[2].value - LB[0].value;
         f1 = ((ConfigHV / O) * 100);
     } 
     else {
         var ConfigHV = Btn - Top;
         var O = LB[3].value - LB[1].value;
         f1 = ((ConfigHV / O) * 100);
     }
     activeDocument.activeLayer.resize(f1, f1, AnchorPosition.MIDDLECENTER);
     app.refresh();
 }


enquandrar_Cont(1); ////// ou 2