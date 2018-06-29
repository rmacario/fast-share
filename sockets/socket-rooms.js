'use strict'

const fileManager = require('../file-content-manager/file-manager');
const constants   = require('../constants/constants');   
const moment      = require('moment');

const sockets     = [];
const openedRooms = [];


const setSocketCurrentRoom = (pSocket, roomName) => {
    let socket  = {};
    socket.id   = pSocket.id;
    socket.room = roomName;
    socket.ip   = pSocket.handshake.address;
    sockets.push(socket);
}

const enterRoom = (socket, roomName) => {
    let room = openedRooms.filter(item => item.name == roomName);
    
    if (!room || room.length == 0) {
        room = {};
        room.name = roomName;
        room.members = [];
        room.members.push(socket.id);

        openedRooms.push(room);

    } else {
        room[0].members.push(socket.id);
    }
}

const leaveRoom = (room, socket) => {
    let roomIndex = room[0].members.indexOf(socket[0].id);
    room[0].members.splice(roomIndex, 1);
    delete socket.rooms;
}

const _getCurrentTime = () => {
    return moment(new Date()).format("DD/MM/YYYY HH:mm");
}

const saveHistory = (room, socket) => {
    let history = `[${_getCurrentTime()}] - ${socket.handshake.address} acessou ${room}.\r\n`;
    
    fileManager.makeDirIfNotExists(constants.HISTORY_FOLDER_PATH, function() {
        fileManager.writeFile(constants.HISTORY_FILE_PATH, history, true, true)
    });
}

// ----------------------------------------------------
// Exports

module.exports.joinRoom = (socket, roomName) => {
    setSocketCurrentRoom(socket, roomName);
    enterRoom(socket, roomName);
    saveHistory(roomName, socket);
}

module.exports.leaveRoom = (pSocket) => {
    let socket = sockets.filter(socketItem => pSocket.id == socketItem.id);
    
    if (socket && socket.length > 0) {
        let room = openedRooms.filter(roomItem => socket[0].room == roomItem.name);
        leaveRoom(room, socket);
    }
}

module.exports.getUsersOnline = () => {
    let usersOnline = [];
    
    for (let i = 0; i < openedRooms.length; i++) {
        if (openedRooms[i].members && openedRooms[i].members.length > 0) {

            for (let j = 0; j < openedRooms[i].members.length; j++) {
                let usr = {};
                usr.room   = openedRooms[i].name;

                let socket = sockets.filter(socket => socket.id == openedRooms[i].members[j]);
                if (socket && socket.length > 0) {
                    usr.socket = socket[0].id;
                    usr.ip     = socket[0].ip;
                }
                usersOnline.push(usr);
            }
        }
    }

    return usersOnline;
}