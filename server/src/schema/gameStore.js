const Game = require("./game");
const { GameNotFound } = require('../errors');

class GameStore {
    static _instance;
    static getInstance() {
        if (GameStore._instance == null) {
            GameStore._instance = new GameStore();
        }
        return GameStore._instance
    };
    static resetStore() {
        GameStore.getInstance();
        GameStore._instance._gamesByCode = {};
    };

    constructor() {
        this._gamesByCode = {};
    };

    generateNewGame() {
        let newGame = new Game();
        let code = newGame.getCode();
        this._gamesByCode[code] = newGame;
        return code
    };

    getGameByCode(code) {
        if (code in this._gamesByCode === false) {
            throw new GameNotFound();
        }
        return this._gamesByCode[code];
    };
};

exports = module.exports = GameStore;