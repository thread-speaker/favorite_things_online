const GameStore = require("../schema/gameStore");
const SocketManager = require("../socketManager");

const registerLobbyActions = (socket) => {
    socket.on("createGame", data => {
        createGame(socket, data);
    });
    socket.on("joinGame", data => {
        joinGame(socket, data);
    });
    socket.on("startGame", data => {
        startGame(socket, data);
    });
};

const createGame = (socket, actionData) => {
    // Initial data check
    if (typeof actionData === 'string' || actionData instanceof String) {
        actionData = {
            'playerName': actionData,
        };
    }
    if (!('playerName' in actionData)) {
        socket.emit('error', 'data must include playerName');
        return;
    }

    const gameStore = GameStore.getInstance();
    const gamecode = gameStore.generateNewGame();
    actionData['gameCode'] = gamecode;
    joinGame(socket, actionData);
};

const joinGame = (socket, actionData) => {
    // Initial data checks
    if (!('playerName' in actionData)) {
        socket.emit('error', 'data must include playerName');
        return;
    }
    if (!('gameCode' in actionData)) {
        socket.emit('error', 'data must include gameCode');
        return;
    }

    let playerName = actionData.playerName;
    let gameCode = actionData.gameCode;

    // TODO: reconnect socket to "dead" player if name and code match

    let socketManager = SocketManager.getInstance();
    let socketAttached = socketManager.joinSocketToGame(socket, gameCode);
    if (socketAttached) {
        try {
            let game = GameStore.getInstance().getGameByCode(gameCode);
            game.addPlayer(playerName, socket);
            
            socketManager.gameEmit(gameCode, 'playerList', game.listPlayers());
        }
        catch {
            socketManager.disconnectSocketfromGame(socket, false)
            socket.emit('error', 'failed to retrieve game info');
            return;
        }
    }
    else {
        socket.emit('error', 'can not find game or it is full');
        return;
    }
};

const startGame = (socket, actionData) => {
    let socketManager = SocketManager.getInstance();
    let gameCode = SocketManager.getInstance().getCodeBySocket(socket);
    let game = GameStore.getInstance().getGameByCode(gameCode);
    let canStart = game.canStart();
    if (canStart) {
        game.start();
        socketManager.gameEmit(gameCode, 'chooseCategory', game.gameState());
    }
    else{
        let msg = 'not enough players';
        if (game.isStarted()) msg = 'game already started';
        socket.emit('error', msg);
    }
};

exports = module.exports = {
    registerLobbyActions,
    joinGame,
    startGame,
};
