const { MAXPLAYERNAMELENGTH } = require("./constants");
const { PlayerNameTooLong } = require("./errors");

class Player {
    constructor(playerName, socket) {
        if (playerName.length > MAXPLAYERNAMELENGTH) {
            throw new PlayerNameTooLong();
        }
        this.name = playerName;
        this.score = 0;
        this.category = '';
        this.labellingPlayer = null;
        this.hand = [];
        this.socket = socket; // socket is used as an identifier, so we will know who is attempting to play and if it is their turn.
    };

    gameState() {
        return {
            name: this.name,
            score: this.score,
            category: this.category,
            hand: this.hand,
        };
    };
};

module.exports = Player;