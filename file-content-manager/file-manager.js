'use strict'

const fs          = require('fs');
const lineReader  = require('line-reader');
const prependFile = require('prepend-file');
const constants   =  require('../constants/constants');


const _nameAsFile = (name) => {
    name = name + ".txt";
    return name.startsWith('/') ? name.substring(1) : name;
}

const _getPathFile = (fileName) => {
    return process.cwd() + '/' + constants.SHARED_PATH + '/' + _nameAsFile(fileName);
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

module.exports.writeFile = (name, content, shouldAppend, writeAtStart) => {
    try {
        if (!_fileExists(name)) {
            _createFile(name);
        }

        if (shouldAppend) {
            if (writeAtStart) {
                prependFile(_getPathFile(name), content, (error) => {
                    if (error) {
                        console.log('Erro ao escrever em arquivo (prepend): ' + error);
                    }
                });

            } else {
                fs.appendFile(_getPathFile(name), content, (error) => {
                    if (error) {
                        console.log('Erro ao escrever em arquivo: ' + error);
                    }
                });
            }

        } else {
            let stream = fs.createWriteStream(_getPathFile(name));

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

module.exports.readFileAsync = (fileName, startLine, endLine) => {
    let content = [];
    let countLine = 0;

    if (_fileExists(fileName)) {

        return new Promise((resolve, reject) => {
            lineReader.eachLine(_getPathFile(fileName), (line, last) => {
                if (countLine < endLine) {
                    content.push(line);
                    countLine++;

                } else {
                    resolve(content);
                    return false;
                }

                if (last) {
                    resolve(content);
                }
            });
        });
    } else {
        return content;
    }
}

module.exports.makeDirIfNotExists = (dirName, cb) => {
    let dirPath = constants.SHARED_PATH + '/' + dirName;

    fs.mkdir(dirPath, (error) => {
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

module.exports.getFileSize = (fileName) => {
    return new Promise((resolve, reject) => {
        fs.stat(_getPathFile(fileName), (err, stat) => {
            if (!err)
                resolve(stat.size);
            else 
                reject();
        });
    });
}