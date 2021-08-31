// require models
const sequelize = require('../utils/database');
var initModels = require("../models/init-models");
var models = initModels(sequelize);
// end of require models

const generator = require('generate-password');

exports.postGeneratePassword = (req, res, next) => {
    let atLeastOnePicked = false;
    let length = req.body.length;
    let numbers = req.body.numbers;
    let symbols = req.body.symbols;
    let lowercase = req.body.lowercase;
    let uppercase = req.body.uppercase;
    let excludeSimilarCharacters = req.body.excludeSimilarCharacters;
    let exclude = req.body.exclude;
    let strict = req.body.strict;

    if (length == "") length = 10;
    if (numbers == "on") { numbers = true; atLeastOnePicked = true; } else numbers = false;
    if (symbols == "on") { symbols = true; atLeastOnePicked = true; } else symbols = false;
    if (lowercase == "on") { lowercase = true; atLeastOnePicked = true; } else lowercase = false;
    if (uppercase == "on") { uppercase = true; atLeastOnePicked = true; } else uppercase = false;
    if (excludeSimilarCharacters == "on") { excludeSimilarCharacters = true; atLeastOnePicked = true; } else excludeSimilarCharacters = false;
    if (exclude != "") atLeastOnePicked = true; 
    if (strict == "on") { strict = true; atLeastOnePicked = true; } else strict = false;
    
    let constructedPassword;

    if (atLeastOnePicked) {
        errorObject = { message: "All good", existsAt: { pwGen: false, shortener: false, expiration: false } };
    
        constructedPassword = generator.generate({
            length: length,
            numbers: numbers,
            symbols: symbols,
            lowercase: lowercase,
            uppercase: uppercase,
            excludeSimilarCharacters: excludeSimilarCharacters,
            exclude: exclude,
            strict: strict
        });
    }
    else errorObject = { message: "You should pick at least one option!", existsAt: { pwGen: true, shortener: false, expiration: false } };

    res.render('index.ejs', {
        constructedPassword: constructedPassword,
        shortURL: null,
        errorObject: errorObject,
        chosen: "pwGen"
    })
}
