const { MAXPLAYERS } = require('../constants');
const { GameFull } = require('../errors');
const Player = require('./player');
const GameState = require('./gameState');

class Game {
    constructor(codeLength = 5) {
        const chars = "1234567890";

        let code = "";
        for (let i = 0; i < codeLength; i++) {
            const cIndex = Math.floor(Math.random() * chars.length);
            const nextChar = chars[cIndex];
            code = code + nextChar;
        }

        this._code = code;
        this._players = [];
        this._round = 0; // 0 is for setup. Gameplay will take place during rounds 1-3. 4 means it's finished.
        this._state = GameState.WaitingforPlayers;
    };

    getCode() {
        return this._code;
    };

    addPlayer(playerName, socket) {
        if (this.isFull()) {
            throw new GameFull();
        }
        let newPlayer = new Player(playerName, socket);
        this._players.push(newPlayer);
    };

    getPlayers() {
        return this._players;
    };

    isFull() {
        return this._players.length >= MAXPLAYERS;
    }

    gameState() {
        // returns an object representing the "public" form of the game for the UI to display
        return {
            players: this._players.map(p => p.gameState()),
        };
    };
};

exports = module.exports = Game;