const { MAXPLAYERNAMELENGTH } = require("./constants");
const { PlayerNameTooLong } = require("./errors");

class Player {
    constructor(playerName) {
        if (playerName.length > MAXPLAYERNAMELENGTH) {
            throw new PlayerNameTooLong();
        }
        this.name = playerName;
        this.score = 0;
        this.category = '';
        this.labellingPlayer = null;
        this.hand = [];
    };
};

module.exports = Player;