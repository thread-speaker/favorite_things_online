class GameState {
    static WaitingforPlayers = new GameState("Waiting For Players");
    static ChooseCategory = new GameState("Choose a Ranking Category");
    static MakeRankedlist = new GameState("Make a Ranked List of Items in Your Category");
    static CardPlay1 = new GameState("Choose a Card to Play (trick 1)");
    static CardPlay2 = new GameState("Choose a Card to Play (trick 2)");
    static CardPlay3 = new GameState("Choose a Card to Play (trick 3)");
    static CardPlay4 = new GameState("Choose a Card to Play (trick 4)");
    static CardPlay5 = new GameState("Choose a Card to Play (trick 5)");
    static GameFinished = new GameState("Game Finished");
  
    constructor(name) {
      this.name = name;
    };
};

module.exports = GameState;