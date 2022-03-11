const GameStore = require("../gameStore");
const SocketManager = require("../socketManager");

let joinGame = (socket, actionData) => {
    let playerName = actionData.playerName;
    let gameCode = actionData.gameCode;

    // TODO: reconnect socket to "dead" player if name and code match

    let socketManager = SocketManager.getInstance();
    let socketAttached = socketManager.joinSocketToGame(socket, gameCode);
    if (socketAttached) {
        try {
            let game = GameStore.getInstance().getGameByCode(gameCode);
            game.addPlayer(playerName, socket);
            
            socketManager.gameEmit(gameCode, 'playerList', game.gameState());
        }
        catch {
            socketManager.disconnectSocketfromGame(socket, false)
        }
    }
};

exports = module.exports = {
    joinGame,
};
