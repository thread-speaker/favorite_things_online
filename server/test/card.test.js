const assert = require('assert');
const Card = require('../src/card');
const CardValue = require('../src/cardValue');
const { MAXLABELLENGTH } = require('../src/constants');
const { CardLabelTooLong } = require('../src/errors');

describe('Card', () => {
    describe('constructor', () => {
        it('keeps value as is if it isinstance CardValue', () => {
            let newCard = new Card('Pizza', CardValue.First);
            newCard._valueHidden = false;
            assert.equal(newCard.getValue(), CardValue.First);
        });

        it('maps numeric values to CardValues', () => {
            cards = [
                [new Card('Dirt', 0), CardValue.Dislike],
                [new Card('Pizza', 1), CardValue.First],
                [new Card('Pasta', 2), CardValue.Second],
                [new Card('Chicken Parmesan', 3), CardValue.Third],
                [new Card('Sandwiches', 4), CardValue.Fourth],
                [new Card('Eggs', 5), CardValue.Fifth],
            ];
            cards.forEach(cardTuple => {
                let card = cardTuple[0];
                let expected = cardTuple[1];
                card._valueHidden = false;
                assert.equal(card.getValue(), expected);
            });
        });

        it('throws an error if a label is too long', () => {
            let longLabel = '';
            for (let i = 0; i < MAXLABELLENGTH + 1; i++) {
                longLabel = longLabel + "M";
            }

            assert.throws(() => { new Card(longLabel, CardValue.First) }, CardLabelTooLong);
        });
    });

    describe('value visibility', () => {
        it('hides value if set to hidden', () => {
            let newCard = new Card('Pizza', CardValue.First);

            // new cards should default to a hidden value state.
            assert.equal(newCard.getValue(), CardValue.Hidden);

            // make the value visible
            newCard._valueHidden = false;
            assert.equal(newCard.getValue(), CardValue.First);
        });
    });
});