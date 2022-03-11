const assert = require('assert');
const Game = require('../../src/schema/game');
const { GameNotFound } = require('../../src/errors');
const GameStore = require('../../src/schema/gameStore');

describe('GameStore', () => {
    beforeEach(() => {
        GameStore.resetStore();
    });

    describe('singleton instance', () => {
        it('always gets the same instance', () => {
            let instance1 = GameStore.getInstance();
            let instance2 = GameStore.getInstance();
            assert(instance1 instanceof GameStore);
            assert(instance2 instanceof GameStore);
            assert.equal(instance1, instance2);
        });
    });

    describe('generateNewGame', () => {
        it('adds a Game to the gamesBycode storage', () => {
            let newGameStore = new GameStore();
            let beforeLength = Object.keys(newGameStore._gamesByCode).length;
            let code = newGameStore.generateNewGame();
            let afterLength = Object.keys(newGameStore._gamesByCode).length
            assert(code in newGameStore._gamesByCode);
            assert(newGameStore._gamesByCode[code] instanceof Game)
            assert.equal(beforeLength + 1, afterLength);
        });
    });

    describe('getGameByCode', () => {
        it('retrieves an existing game successfully', () => {
            let newGameStore = new GameStore();
            let newGame = new Game();
            let code = newGame._code;
            newGameStore._gamesByCode[code] = newGame; // Maually set _gamesByCode so we aren't inadvertently testing that as well

            let actual = newGameStore.getGameByCode(code);
            assert.equal(actual, newGame);
        });

        it('raises an error for non-existing game codes', () => {
            let newGameStore = new GameStore();
            let badCode = "FOOBAR"

            assert.throws(() => {newGameStore.getGameByCode(badCode)}, GameNotFound);
        });
    });
});