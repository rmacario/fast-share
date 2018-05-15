'use strict'
const fileManager = require('../file-content-manager/file-manager');
const constants   = require('../constants/constants');

module.exports.getContent = (room) => {
    let fileName = '/' + room.substring(1).replace(/\//, ".");
    return fileManager.readFile(fileName);
}

module.exports.write = (path, content) => {
    fileManager.writeFile('/' + path.substring(1).replace(/\//, "."), content, false);
}

module.exports.readHistory = (startLine, endLine) => {
    return fileManager.readFileAsync(constants.HISTORY_PATH, startLine, endLine, 'desc');
}