// require models
const sequelize = require('../utils/database');
var initModels = require("../models/init-models");
var models = initModels(sequelize);
// end of require models

const generateMessageObj = require('../utils/generateMessageObj');
const calcDays = require('../utils/calcDays');
const DAYS_LINK_LIVE = 5;

exports.getLanding = (req, res, next) => {

    res.render('index.ejs', { 
        constructedPassword: null,
        shortURL: null,
        qrImg: null,
        errorObject: generateMessageObj.noError(),
        chosen: "shortener" 
    })
}

exports.getLongURL = (req, res, next) => {
    const code = req.params.code;
    models.Links.findOne({ where: { code: code } })
    .then(record => {
        if (record) {

            const daysExist = calcDays(Date.now(), record.createdAt);

            if (daysExist > DAYS_LINK_LIVE) {

                models.Links.destroy({ where: { code: code } })
                .then(() => {
                    return res.render('index.ejs', {
                        constructedPassword: null,
                        shortURL: null,
                        qrImg: null,
                        errorObject: generateMessageObj.errorAt("shortener", "This Short URL has expired!"),
                        chosen: "shortener"
                    })
                })
                .catch(err => {
                    return res.render('index.ejs', {
                        constructedPassword: null,
                        shortURL: null,
                        qrImg: null,
                        errorObject: generateMessageObj.errorAt("shortener", "Something went wrong, please try again later!"),
                        chosen: "shortener"
                    })
                })

            }
            else return res.redirect(record.longURL);
        }
        else {
            return res.render('index.ejs', {
                constructedPassword: null,
                shortURL: null,
                qrImg: null,
                errorObject: generateMessageObj.errorAt("shortener", "This Short URL does not exist!"),
                chosen: "shortener"
            })
        }
    })
    .catch(err => {
        return res.render('index.ejs', {
            constructedPassword: null,
            shortURL: null,
            qrImg: null,
            errorObject: generateMessageObj.errorAt("shortener", "Something went wrong, please try again later!"),
            chosen: "shortener"
        })
    })
}