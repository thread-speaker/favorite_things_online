const assert = require('assert');
const GameStore = require('../src/schema/gameStore');
const SocketManager = require('../src/socketManager');

describe('SocketManager', () => {
    beforeEach(() => {
        SocketManager.resetManager();
        GameStore.resetStore();
    });

    describe('singleton instance', () => {
        it('always gets the same instance', () => {
            let instance1 = SocketManager.getInstance();
            let instance2 = SocketManager.getInstance();
            assert(instance1 instanceof SocketManager);
            assert(instance2 instanceof SocketManager);
            assert.equal(instance1, instance2);
        });
    });

    describe('joinSocketToGame', () => {
        it('works for valid game codes', () => {
            let socket = 'a totally legit socket';
            let code = GameStore.getInstance().generateNewGame();

            let socketManager = SocketManager.getInstance();
            let result = socketManager.joinSocketToGame(socket, code);

            assert(result);
            assert.equal(socketManager._codesBySocket[socket], code);
            assert.equal(socketManager._socketsByCode[code].length, 1);
            assert.equal(socketManager._socketsByCode[code][0], socket);
        });
        
        it('fails for invalid game codes', () => {
            let socket = 'a totally legit socket';
            let badCode = 1234567890;

            let socketManager = SocketManager.getInstance();
            let result = socketManager.joinSocketToGame(socket, badCode);

            assert.equal(result, false);
            assert.equal(socket in socketManager._codesBySocket, false);
            assert.equal(badCode in socketManager._socketsByCode, false);
        });
    });
});