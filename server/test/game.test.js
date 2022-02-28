const assert = require('assert');
const { MAXPLAYERS } = require('../src/constants');
const { GameFull } = require('../src/errors');
const Game = require('../src/game');
const Player = require('../src/player');

describe('Game', () => {
    describe('constructor', () => {
        it('generates a game code', () => {
            let newGame = new Game();
            assert.notEqual(newGame._code, '');
        });

        it('generates a game code of length 5 if no length specified', () => {
            let newGame = new Game();
            assert.equal(newGame._code.length, 5);
        });
        
        it('generates a game code of a specified length if given', () => {
            let expectedLength = 6;
            let newGame = new Game(expectedLength);
            assert.equal(newGame._code.length, expectedLength);
        });
    });

    describe('player pool', () => {
        it('allows getting the player list', () => {
            let newGame = new Game();
            newPlayer = new Player('Amaya');
            newGame._players.push(newPlayer);
            actual = newGame.getPlayers();
            assert.equal(actual.length, 1);
            assert.equal(actual[0], newPlayer);
        });

        it('adds new players to pool', () => {
            let newGame = new Game();
            let playerName = 'Amaya'
            newGame.addPlayer(playerName);
            actual = newGame._players;
            assert.equal(actual.length, 1);
            assert.equal(actual[0].name, playerName)
        });

        it('will not add players to pool if it is full', () => {
            let newGame = new Game();
            for (let i = 0; i < MAXPLAYERS; i++) {
                newGame._players.push(new Player("Player " + i));
            }

            assert.throws(() => {newGame.addPlayer('Amaya')}, GameFull);
        });

        it('indicates if the player pool is full', () => {
            let newGame = new Game();

            assert.equal(newGame.isFull(), false);
            for (let i = 0; i < MAXPLAYERS; i++) {
                newGame._players.push(new Player("Player " + i));
            }
            assert.equal(newGame.isFull(), true);
        });
    });
});