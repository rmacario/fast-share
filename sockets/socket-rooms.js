'use strict'

const sockets = new Object();
const openedRooms = new Object();


const setSocketCurrentRoom = (socket, roomName) => {
    sockets[socket.id] = roomName;
}

const enterRoom = (socket, roomName) => {
    if (openedRooms[roomName] == undefined) {
        openedRooms[roomName] = new Array();
    } 
    openedRooms[roomName].push(socket.id);
}

const leaveRoom = (room, socketId) => {
    room.splice(room.indexOf(socketId), 1);
}



module.exports.joinRoom = (socket, roomName) => {
    setSocketCurrentRoom(socket, roomName);
    enterRoom(socket, roomName);
}

module.exports.leaveRoom = (socket) => {
    let roomName = sockets[socket.id];
    if (openedRooms[roomName] != undefined) {
        leaveRoom(openedRooms[roomName], socket.id);
        sockets[socket.id] = undefined;
    }
}