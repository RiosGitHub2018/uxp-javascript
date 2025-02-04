async function checkAndRenameFile(filename) {
    try {
        const folder = await fs.getEntryWithUrl(`file:${path}`); 
        const files = await folder.getEntries();

        let fileExists = false;
        for (const file of files) { if (file.name === filename) { fileExists = true; break; }
        }

        if(fileExists) {
            let contag = 1;
            let newFileName = filename;
            const fileExtension = filename.split('.').pop();
            const estampa = filename.slice(0, -fileExtension.length - 1);

            // Enquanto o arquivo existir, incrementa o número no nome
            while (fileExists) {
                newFileName = `${estampa}_${contag}.${fileExtension}`;
                fileExists = files.some(file => file.name === newFileName);
                contag++;
            }

            alert(`O arquivo "${filename}" existe no diretório. O novo nome será "${newFileName}".`);
        } else {
            alert(`O arquivo "${filename}" não existe no diretório.`);
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}