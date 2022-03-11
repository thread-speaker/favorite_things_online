const GameStore = require("./schema/gameStore");

class SocketManager {
    static _instance;
    static getInstance() {
        if (SocketManager._instance == null) {
            SocketManager._instance = new SocketManager();
        }
        return SocketManager._instance
    };
    static resetManager() {
        SocketManager.getInstance();
        SocketManager._instance._socketsByCode = {};
        SocketManager._instance._codesBySocket = {};
    };

    constructor() {
        this._gameStore = GameStore.getInstance();
        this._socketsByCode = {};
        this._codesBySocket = {};
    };

    getSocketsByCode(gamecode) {
        return this._socketsByCode[gamecode];
    };

    getCodeBySocket(socket) {
        return this._codesBySocket[socket];
    };

    gameEmit(gameCode, event, eventData = null) {
        this._socketsByCode[gameCode].forEach(socket => {
            socket.emit(event, eventData);
        });
    };

    joinSocketToGame(socket, gameCode) {
        try {
            let game = this._gameStore.getGameByCode(gameCode);
            if (game.isFull()) {
                // Can not join full lobby
                return false;
            }
            
            if (!(gameCode in this._socketsByCode)) {
                this._socketsByCode[gameCode] = [];
            }
            this._socketsByCode[gameCode].push(socket);
            this._codesBySocket[socket] = gameCode;
        }
        catch (err) {
            // Probably a bad game code.
            return false;
        }
        return true;
    };

    disconnectSocketFromGame(socket, trackDeadPlayer = false) {
        // Removes the socket from both _socketsByCode and _codeBySocket
        // iff the socket exists in them in the first place
        if (socket in this._codesBySocket) {
            let gameCode = this._codesBySocket[socket];
            var socketIndex = this._socketsByCode[gameCode].indexOf(socket);
            if (socketIndex !== -1) {
                this._socketsByCode[gameCode].splice(socketIndex, 1);
            }
            delete this._codesBySocket[socket];

            // TODO: track "dead" players to be reattached later.
        }
    };
};

exports = module.exports = SocketManager;