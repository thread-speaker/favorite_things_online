const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");
const assert = require('assert');
const { registerLobbyActions, createGame } = require("../../src/actions/lobbyActions");
const SocketManager = require("../../src/socketManager");
const GameStore = require("../../src/schema/gameStore");
const { MAXPLAYERS, MINPLAYERS } = require("../../src/constants");
const Player = require("../../src/schema/player");

describe("lobbyActions", () => {
  let io, serverSocket, clientSocket, clientSocket2, clientSocket3, port;

  before((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      clientSocket2 = new Client(`http://localhost:${port}`);
      clientSocket3 = new Client(`http://localhost:${port}`);
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
    clientSocket2.close();
    clientSocket3.close();
  });

  beforeEach(() => {
    GameStore.resetStore();
    SocketManager.resetManager();
  });

  afterEach(() => {
    clientSocket.removeListener('playerList');
    clientSocket.removeListener('chooseCategory');
    clientSocket.removeListener('error');
    clientSocket3.removeListener('playerList');
  });

  describe('createGame', () => {
    it('creates and joins a game', (done) => {
      clientSocket.on("playerList", (arg) => {
        assert.equal(arg.players.length, 1);
        assert.equal(arg.players[0], 'Amaya');
        done();
      });

      clientSocket.emit("createGame", {
        'playerName': 'Amaya',
      });
    });
    
    it('will accept a raw string as playerName', (done) => {
      clientSocket.on("playerList", (arg) => {
        assert.equal(arg.players.length, 1);
        assert.equal(arg.players[0], 'Amaya');
        done();
      });

      clientSocket.emit("createGame", 'Amaya');
    });
    
    it('fails without a playerName', (done) => {
      clientSocket.on("error", (arg) => {
        assert.equal(arg, 'data must include playerName');
        done();
      });

      clientSocket.emit("createGame", {
        'foo': 'bar',
      });
    });
  });

  describe("joinGame", () => {
    it("works on happy path", (done) => {
      // Generate a game
      const gameStore = GameStore.getInstance();
      const gameCode = gameStore.generateNewGame();

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
        assert.equal(arg, 'data must include gameCode');
        done();
      });

      clientSocket.emit("joinGame", {
        'playerName': 'Amaya',
      });
    });
    
    it("fails for missing playerName", (done) => {
      // Generate a game
      clientSocket.on("error", (arg) => {
        assert.equal(arg, 'data must include playerName');
        done();
      });

      clientSocket.emit("joinGame", {
        'gameCode': 1234567,
      });
    });
  });

  describe('startGame', () => {
    it('works on happy path (system create-join-start)', (done) => {
      // Game is started
      clientSocket.on("chooseCategory", (res) => {
        done();
      });

      // Players are in, time to start
      clientSocket3.on("playerList", (res) => {
        clientSocket.emit("startGame");
      });

      // Once the game is created, add some extra dummy players
      // to get the game in a good state to test with
      clientSocket.on("playerList", (res) => {
        const gameCode = res.gameCode;
        for (let i = 0; i < MINPLAYERS - 1; i++) {
          clientSocket2.emit("joinGame", {
            playerName: "Sein",
            gameCode,
          });
          clientSocket3.emit("joinGame", {
            playerName: "Reykel",
            gameCode,
          });
        }
      });

      clientSocket.emit("createGame", "Amaya");
    });

    it('fails if not enough players', (done) => {
      clientSocket.on("error", (res) => {
        assert.equal(res, 'not enough players');
        done();
      });

      createGame(serverSocket, "Amaya");
      clientSocket.emit("startGame");
    });
    
    it('fails if game already started', (done) => {
      clientSocket.on("error", (res) => {
        assert.equal(res, 'game already started');
        done();
      });

      // Setup a game and mark it as started
      createGame(serverSocket, "Amaya");
      const gameCode = SocketManager.getInstance()._codesBySocket[serverSocket];
      const game = GameStore.getInstance().getGameByCode(gameCode);
      for (let i = 0; i < MINPLAYERS; i++) {
        game.addPlayer('Player ' + i, {});
      }
      game.start();
      
      // Attempt to start the previously started game
      clientSocket.emit("startGame");
    });
  });
});