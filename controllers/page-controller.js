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

module.exports.readHistory = async () => {

    let fileSize = await fileManager.getFileSize(constants.HISTORY_PATH);
    let content = (fileSize == 0 ? [] :
            await fileManager.readFileAsync(constants.HISTORY_PATH, 0, constants.MAX_LINES_HIST));

    if (content && content.length > 0) {
        content = content.reverse();

    } else {
        content = [];
    }

    return content;
}