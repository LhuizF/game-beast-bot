// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

function getPath(basePath, search, foundFiles) {
  fs.readdirSync(basePath).map(async (file) => {
    const pathFile = `${basePath}/${file}`;
    const stat = fs.statSync(pathFile);

    if (stat.isDirectory()) {
      getPath(pathFile, search, foundFiles);
    } else {
      readFile(pathFile, search, foundFiles);
    }
  });
}

function readFile(path, search, foundFiles) {
  const file = fs.readFileSync(path, 'utf8');
  if (file.includes(search)) {
    const lines = file.split('\n');
    const index = lines.findIndex((line) => line.includes(search)) + 1;
    foundFiles.push({ path, line: index });
  }
}

function start() {
  const basePath = './src';
  const searches = ['isLocal: true'];

  searches.forEach((search) => {
    const foundFiles = [];
    getPath(basePath, search, foundFiles);

    if (foundFiles.length > 0) {
      console.log(foundFiles);
      const err = `Arquivos encontrados com: ${search}`;
      throw new Error(err);
    } else{
      console.log(`Nenhum arquivo encontrado com: ${search}`);
    }
  });
}

start();
