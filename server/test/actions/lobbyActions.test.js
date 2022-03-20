const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");
const assert = require('assert');
const { registerLobbyActions } = require("../../src/actions/lobbyActions");
const SocketManager = require("../../src/socketManager");
const GameStore = require("../../src/schema/gameStore");
const { MAXPLAYERS } = require("../../src/constants");
const Player = require("../../src/schema/player");

describe("lobbyActions", () => {
  let io, serverSocket, clientSocket;

  before((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
        registerLobbyActions(socket);
      });
      clientSocket.on("connect", done);
    });
  });

  after(() => {
    io.close();
    clientSocket.close();
  });

  beforeEach(() => {
    GameStore.resetStore();
    SocketManager.resetManager();
  });

  afterEach(() => {
    clientSocket.removeListener('playerList')
    clientSocket.removeListener('error')
  });

  describe("joinGame", () => {
    it("works on happy path", (done) => {
      // Generate a game
      const gameStore = GameStore.getInstance();
      const gameCode = gameStore.generateNewGame();
      // for (let i = 0; i < MAXPLAYERS; i++) {
      //   newGame._players.push(new Player("Player " + i, {}));
      // }

      clientSocket.on("playerList", (arg) => {
        done();
      });

      clientSocket.emit("joinGame", {
        'playerName': 'Amaya',
        gameCode
      });
    });
    
    it("fails for a full game", (done) => {
      // Generate a game
      const gameStore = GameStore.getInstance();
      const gameCode = gameStore.generateNewGame();
      const game = gameStore.getGameByCode(gameCode);
      for (let i = 0; i < MAXPLAYERS; i++) {
        game.addPlayer('Player ' + i, {});
      }

      clientSocket.on("error", (arg) => {
        assert.equal(arg, 'can not find game or it is full');
        done();
      });

      clientSocket.emit("joinGame", {
        'playerName': 'Amaya',
        gameCode
      });
    });
    
    it("fails for a bad gameCode", (done) => {
      // Generate a game
      clientSocket.on("error", (arg) => {
        assert.equal(arg, 'can not find game or it is full');
        done();
      });

      clientSocket.emit("joinGame", {
        'playerName': 'Amaya',
        'gameCode': 1234567,
      });
    });
    
    it("fails for missing gameCode", (done) => {
      // Generate a game
      clientSocket.on("error", (arg) => {
        assert.equal(arg, 'can not find game or it is full');
        done();
      });

      clientSocket.emit("joinGame", {
        'playerName': 'Amaya',
      });
    });
    
    it("fails for missing playerName", (done) => {
      // Generate a game
      clientSocket.on("error", (arg) => {
        assert.equal(arg, 'can not find game or it is full');
        done();
      });

      clientSocket.emit("joinGame", {
        'gameCode': 1234567,
      });
    });
  });

  // TODO: test startGame
});