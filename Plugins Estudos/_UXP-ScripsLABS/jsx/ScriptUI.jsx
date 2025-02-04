
/*
Code for Import https://scriptui.joonas.me — (Triple click to select): 
{"activeId":5,"items":{"item-0":{"id":0,"type":"Dialog","parentId":false,"style":{"enabled":true,"varName":null,"windowType":"Dialog","creationProps":{"su1PanelCoordinates":false,"maximizeButton":false,"minimizeButton":false,"independent":false,"closeButton":true,"borderless":false,"resizeable":false},"text":"Dialog","preferredSize":[300,200],"margins":16,"orientation":"column","spacing":10,"alignChildren":["center","top"]}},"item-1":{"id":1,"type":"EditText","parentId":0,"style":{"enabled":true,"varName":null,"creationProps":{"noecho":false,"readonly":false,"multiline":false,"scrollable":false,"borderless":false,"enterKeySignalsOnChange":false},"softWrap":false,"text":"EditText","justify":"left","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-2":{"id":2,"type":"Divider","parentId":0,"style":{"enabled":true,"varName":null}},"item-3":{"id":3,"type":"Button","parentId":0,"style":{"enabled":true,"varName":null,"text":"Button","justify":"center","preferredSize":[0,0],"alignment":null,"helpTip":null}},"item-4":{"id":4,"type":"DropDownList","parentId":0,"style":{"enabled":true,"varName":null,"text":"DropDownList","listItems":"Item 1, -, Item 2","preferredSize":[0,0],"alignment":null,"selection":0,"helpTip":null}},"item-5":{"id":5,"type":"RadioButton","parentId":0,"style":{"enabled":true,"varName":null,"text":"RadioButton","preferredSize":[0,0],"alignment":null,"helpTip":null}}},"order":[0,1,2,3,4,5],"settings":{"importJSON":true,"indentSize":false,"cepExport":false,"includeCSSJS":true,"showDialog":true,"functionWrapper":false,"afterEffectsDockable":false,"itemReferenceList":"None"}}
*/ 

// DIALOG
// ======

var dialog = new Window("dialog"); 
    dialog.text = "Dialog"; 
    dialog.preferredSize.width = 300; 
    dialog.preferredSize.height = 200; 
    dialog.orientation = "column"; 
    dialog.alignChildren = ["center","top"]; 
    dialog.spacing = 10; 
    dialog.margins = 16; 

var edittext1 = dialog.add('edittext {properties: {name: "edittext1"}}'); 
    edittext1.text = "EditText"; 

var divider1 = dialog.add("panel", undefined, undefined, {name: "divider1"}); 
    divider1.alignment = "fill"; 

var button1 = dialog.add("button", undefined, undefined, {name: "button1"}); 
    button1.text = "Button"; 

var dropdown1_array = ["Item 1","-","Item 2"]; 
var dropdown1 = dialog.add("dropdownlist", undefined, undefined, {name: "dropdown1", items: dropdown1_array}); 
    dropdown1.selection = 0; 

var radiobutton1 = dialog.add("radiobutton", undefined, undefined, {name: "radiobutton1"}); 
    radiobutton1.text = "RadioButton"; 

dialog.show();

