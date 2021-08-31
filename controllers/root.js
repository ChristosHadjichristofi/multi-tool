// require models
const sequelize = require('../utils/database');
var initModels = require("../models/init-models");
var models = initModels(sequelize);
// end of require models

const getStatistics = require('../utils/getStatistics');

const calcDays = require('../utils/calcDays');
const DAYS_LINK_LIVE = 5;

exports.getLanding = (req, res, next) => {

    getStatistics()
    .then(stats => {
        if (stats == null) {
            errorObject = { 
                message: "Something went wrong, please try again later!", 
                existsAt: { shortener: true, pwGen: false, expiration: false } 
            };
        }
        else {
            errorObject = { 
                message: "All good", 
                existsAt: { pwGen: false, shortener: false, expiration: false } 
            };
        }

        return res.render('index.ejs', { 
            constructedPassword: null,
            shortURL: null,
            stats: stats,
            errorObject: errorObject,
            chosen: "shortener" 
        });
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
                        errorObject: { 
                            message: "This Short URL has expired!", 
                            existsAt: { shortener: true, pwGen: false, expiration: false } 
                        },
                        chosen: "shortener"
                    })
                })
                .catch(err => {
                    return res.render('index.ejs', {
                        constructedPassword: null,
                        shortURL: null,
                        errorObject: { 
                            message: "Something went wrong, please try again later!", 
                            existsAt: { shortener: true, pwGen: false, expiration: false } 
                        },
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
                errorObject: { 
                    message: "This Short URL does not exist!", 
                    existsAt: { shortener: true, pwGen: false, expiration: false } 
                },
                chosen: "shortener"
            })
        }
    })
    .catch(err => {
        return res.render('index.ejs', {
            constructedPassword: null,
            shortURL: null,
            errorObject: { 
                message: "Something went wrong, please try again later!", 
                existsAt: { shortener: true, pwGen: false, expiration: false } 
            },
            chosen: "shortener"
        })
    })
}