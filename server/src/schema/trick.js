class Trick {
    constructor(leadingPlayerIndex) {
        this._leadingPlayerIndex = leadingPlayerIndex;
        this._winningPlayerIndex = null;
        this._winningCard = null;
        this._containsFavorite = false;
        this._playedCards = [];
    };
};