const fs = require('uxp').storage.localFileSystem;
const file = await fs.getFileForOpening();
// if (!file) {
//     // no file selected
//     return;
// }
const text = await file.read();
alert(text)