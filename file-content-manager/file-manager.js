'use strict'
const fs   = require('fs');
const path = "shared\\";

const _nameAsFile = (name) => {
    name = name + ".txt";
    return name.startsWith('/') ? name.substring(1) : name;
}

const _getPathFile = (fileName) => {
    return process.cwd() + '\\' + path + _nameAsFile(fileName);
}

const _fileExists = (fileName) => {
    return fs.existsSync(_getPathFile(fileName));
};

const _createFile = (fileName) => {
    try {
        fs.closeSync(fs.openSync(_getPathFile(fileName), 'w'));
    } catch(e) {
        console.log('Erro ao criar arquivo ' + _getPathFile(fileName) + ': ' + e);
        throw 'FileCreateError';
    }
}

//------------------------------------
// Exports

module.exports.writeFile = (name, content, shouldAppend) => {
    try {
        if (!_fileExists(name)) {
            _createFile(name);
        }

        if (shouldAppend) {
            fs.appendFile(path + _nameAsFile(name), content, (error) => {
                if (error) {
                    console.log('Erro ao escrever em arquivo: ' + error);
                }
            });

        } else {
            let stream = fs.createWriteStream(path + _nameAsFile(name));

            stream.once('open', (fd) => {
                stream.write(content);
                stream.end();
            });
            stream.on('error', err => console.log('Erro ao escrever no arquivo ' + _nameAsFile(name)));
        }

    } catch(e) {
        console.log('Erro ao escrever conteudo do arquivo: ' + e);
    }
};

module.exports.readFile = (name) => {
    let content = "";
    if (_fileExists(name)) {
        content = fs.readFileSync(_getPathFile(name), 'utf8');
    }
    return content;
};

module.exports.makeDirIfNotExists = (dirName, cb) => {
    fs.mkdir(path + dirName, (error) => {
        if (error) {
            if (error.code == 'EEXIST') {
                cb();

            } else {
                console.log("Erro ao criar diretório: " + error);
            }
            
        } else {
            cb();
        }
    });
};
