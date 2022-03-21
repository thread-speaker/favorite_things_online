const { MAXPLAYERS, MINPLAYERS } = require('../constants');
const { GameFull, GameNotStartable } = require('../errors');
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
        this._tricks = [];
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
    };

    canStart() {
        return this._players.length >= MINPLAYERS && this._round == 0;
    };

    isStarted() {
        return this._round > 0;
    };

    start() {
        if (this.canStart()) {
            let _shufflePlayers = () => {
                // Fisher-Yates shuffle
                let currentIndex = this._players.length,  randomIndex;
                while (currentIndex != 0) {
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex--;
                    [this._players[currentIndex], this._players[randomIndex]] = [
                        this._players[randomIndex], this._players[currentIndex]];
                }
            };

            _shufflePlayers(); // Shuffling players will decide turn order during card playing phases.
            this._round = 1;
            this.gameState = GameState.ChooseCategory;
            return true;
        }
        else {
            throw new GameNotStartable();
        }
    };

    listPlayers() {
        // Used for the game lobby before starting. returns only players' names
        return {
            players: this._players.map(p => p.name),
            gameCode: this._code,
        };
    };

    publicGameState() {
        // returns an object representing the "public" form of the game for the UI to display
        return {
            players: this._players.map(p => p.gameState()),
            gameCode: this._code,
            round: this._round,
            phase: this.gameState,
            currentTrick: null, // TODO: populate this during card play phases
        };
    };
};

exports = module.exports = Game;