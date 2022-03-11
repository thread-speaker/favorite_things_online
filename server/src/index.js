const lobbyActions = require("./actions/lobbyActions");

const Express = require("express")();
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http, {
    cors: {
        origin: "*"
    }
});

Socketio.on("connection", socket => {
    socket.emit("welcome");

    // Register lobby events
    socket.on("joinGame", data => {
        lobbyActions.joinGame(socket, data);
    });
    socket.on("startGame", data => {
        lobbyActions.startGame(socket, data);
    });
});

Http.listen(3000, () => {
    console.log("Listening at :3000...");
});