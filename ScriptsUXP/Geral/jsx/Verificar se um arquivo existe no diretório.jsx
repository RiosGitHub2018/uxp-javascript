document.querySelector("#btnPastavz").addEventListener("click", async evt => {
    const folder = await fs.getEntryWithUrl("file://D:/Testes");
    const files = await folder.getEntries();
  
    let fileExists = false;
  
    for (const file of files) {
      if (file.name === "Scanner_01.jpg") {
        fileExists = true;
        break;
      }
    }
  
    if (fileExists) {
      alert('O arquivo "Scanner_01.jpg" existe no diretório.');
    } else {
      alert('O arquivo "Scanner_01.jpg" não existe no diretório.');
    }
  });