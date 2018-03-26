let pageControler  = require('./controllers/page-controller');
let express        = require('express');
let app            = express();
let http           = require('http').Server(app);
let io             = require('socket.io')(http);
let socketRooms    = require('./sockets/socket-rooms');


app.set('view engine', 'ejs');
app.use(express.static('views'));


io.sockets.on('connection', (socket) => {

    socket.on('disconnect', function () {
        socketRooms.leaveRoom(socket);
    });

    socket.on('onAccess', (room) => {
        socketRooms.joinRoom(socket, room);
        io.sockets.connected[socket.id].emit(room, pageControler.getContent(room));
    });

    socket.on('writeFile', (data) => {
        pageControler.write(data.room, data.content);
        socket.broadcast.emit(data.room, data.content);
    });

});


app.get('/god', (req, res) => {
    res.render('./concretes/god', {
        usersOnline: new Array()
    });
});

app.get('/*', (req, res) => {
    res.render('./concretes/share');
});


http.listen(3000, () => {
    console.log('Server running on port 3000.')
});