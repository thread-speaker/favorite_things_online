class GameNotFound extends Error {};
class GameFull extends Error {};
class GameNotStartable extends Error {};
class BadCardValue extends Error {};
class CardLabelTooLong extends Error {};
class PlayerNameTooLong extends Error {};

exports = module.exports = {
    GameNotFound,
    GameFull,
    GameNotStartable,
    BadCardValue,
    CardLabelTooLong,
    PlayerNameTooLong,
};