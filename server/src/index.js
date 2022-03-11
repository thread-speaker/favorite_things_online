const actions = require("./actions");

const Express = require("express")();
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http, {
    cors: {
        origin: "*"
    }
});

Socketio.on("connection", socket => {
    socket.emit("welcome");
    socket.on("joinGame", data => {
        actions.joinGame(socket, data);
    });
});

Http.listen(3000, () => {
    console.log("Listening at :3000...");
});