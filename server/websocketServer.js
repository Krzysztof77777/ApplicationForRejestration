import http from 'http';
import {
    Server
} from 'socket.io';

const startWebsocketServer = (app, PORT) => {
    const server = http.createServer(app);
    server.listen(PORT)
    const io = new Server(server);

    io.on('connection', (socket) => {
        socket.on('message', function (data) {
            socket.broadcast.emit('message', data);
        })
    });
}

export default startWebsocketServer;