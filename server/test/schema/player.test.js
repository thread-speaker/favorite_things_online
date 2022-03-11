const assert = require('assert');
const { MAXPLAYERNAMELENGTH } = require('../../src/constants');
const { PlayerNameTooLong } = require('../../src/errors');
const Player = require('../../src/schema/player');

describe('Player', () => {
    describe('constructor', () => {
        it('throws an error if the name is too long', () => {
            let longName = '';
            for (let i = 0; i < MAXPLAYERNAMELENGTH + 1; i++) {
                longName = longName + "M";
            }

            assert.throws(() => { new Player(longName, null) }, PlayerNameTooLong);
        });
    });
});