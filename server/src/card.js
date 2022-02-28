const CardValue = require("./cardValue");
const { MAXLABELLENGTH } = require("./constants");
const { BadCardValue, CardLabelTooLong } = require("./errors");

class Card {
    #label;
    #value;
    
    constructor(label, value) {
        // Is the label too long?
        if (label.length > MAXLABELLENGTH) {
            throw new CardLabelTooLong();
        }

        if (Number.isFinite(value)) {
            //We got a number to map to CardValue
            let values = {
                1: CardValue.First,
                2: CardValue.Second,
                3: CardValue.Third,
                4: CardValue.Fourth,
                5: CardValue.Fifth,
                0: CardValue.Dislike
            };
            if (value in values) {
                value = values[value];
            }
            else {
                throw new BadCardValue();
            }
        }
        this.#label = label;
        this.#value = value;
        this._valueHidden = true;
    };

    getLabel() {
        return this.#label;
    };

    getValue() {
        if (this._valueHidden) {
            return CardValue.Hidden;
        }
        return this.#value;
    };

    showValue() {
        this._valueHidden = false;
    };
};

module.exports = Card;