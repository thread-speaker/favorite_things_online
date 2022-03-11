class CardValue {
    static First = new CardValue("First", 1);
    static Second = new CardValue("Second", 2);
    static Third = new CardValue("Third", 3);
    static Fourth = new CardValue("Fourth", 4);
    static Fifth = new CardValue("Fifth", 5);
    static Dislike = new CardValue("Dislike", 0);
    static Hidden = new CardValue("Hidden", -1);
  
    constructor(name, value) {
      this.name = name;
      this.value = value;
    };
};

module.exports = CardValue;