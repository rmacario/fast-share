'use strict'
const fs   = require('fs');
const path = "shared\\";

let nameAsFile = (name) => {
    name = name + ".txt";
    return name.startsWith('/') ? name.substring(1) : name;
}

let getPathFile = (fileName) => {
    return process.cwd() + '\\' + path + nameAsFile(fileName);
}

let fileExists = (fileName) => {
    return fs.existsSync(getPathFile(fileName));
};

let createFile = (fileName) => {
    try {
        fs.closeSync(fs.openSync(getPathFile(fileName), 'w'));
    } catch(e) {
        console.log('Erro ao criar arquivo ' + getPathFile(fileName) + ': ' + e);
        throw 'FileCreateError';
    }
}



module.exports.writeFile = (name, content) => {
    try {
        if (!fileExists(name)) {
            createFile(name);
        }

        let stream = fs.createWriteStream(path + nameAsFile(name));

        stream.once('open', (fd) => {
            stream.write(content);
            stream.end();
        });

        stream.on('error', err => console.log('Erro ao escrever no arquivo ' + nameAsFile(name)));

    } catch(e) {
        console.log('Erro ao escrever conteudo do arquivo: ' + e);
    }
};

module.exports.readFile = (name) => {
    let content = "";
    if (fileExists(name)) {
        content = fs.readFileSync(getPathFile(name), 'utf8');
    }
    return content;
};