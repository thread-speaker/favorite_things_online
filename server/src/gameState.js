class GameState {
    static WaitingforPlayers = new GameState("Waiting For Players");
    static ChooseCategory = new GameState("Choose a Ranking Category");
    static MakeRankedlist = new GameState("Make a Ranked List of Items in Your Category");
    static ChooseCards1 = new GameState("Player 1 Choose a Card to Play");
    static ChooseCards2 = new GameState("Player 2 Choose a Card to Play");
    static ChooseCards3 = new GameState("Player 3 Choose a Card to Play");
    static ChooseCards4 = new GameState("Player 4 Choose a Card to Play");
    static ChooseCards5 = new GameState("Player 5 Choose a Card to Play");
    static ChooseCards6 = new GameState("Player 6 Choose a Card to Play");
    static GameFinished = new GameState("Game Finished");
  
    constructor(name) {
      this.name = name;
    };
};

module.exports = GameState;