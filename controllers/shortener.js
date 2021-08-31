// require models
const sequelize = require('../utils/database');
var initModels = require("../models/init-models");
var models = initModels(sequelize);
// end of require models

const calcDays = require('../utils/calcDays');
const DAYS_LINK_LIVE = 5;

const validUrl = require('valid-url');
const shortid = require('shortid');

exports.postShortURL = (req, res, next) => {

    const longURL = req.body.longURL;
    const createdAt = Date.now();
    let errorOccured = false;
    let baseURL = req.get('host');

    if (longURL == "") {
        errorOccured = true;
        errorObject = { 
            message: "Input cannot be empty!", 
            existsAt: { shortener: true, pwGen: false, expiration: false } 
        };
    }

    if (!validUrl.isUri(baseURL)) {
        errorOccured = true;
        errorObject = { 
            message: "Invalid Base URL!", 
            existsAt: { shortener: true, pwGen: false, expiration: false } 
        };

    }
    
    if (errorOccured) {
        return res.render('index.ejs', {
            constructedPassword: null,
            shortURL: null,
            errorObject: errorObject,
            chosen: "shortener"
        })
    }
    
    const urlCode = shortid.generate();

    if (validUrl.isUri(longURL)) {
        models.Links.findOne({ where: { longURL: longURL } })
        .then(record => {
            if (record) {
                return res.render('index.ejs', {
                    constructedPassword: null,
                    shortURL: record.shortURL,
                    errorObject: { 
                        message: "All good", 
                        existsAt: { shortener: false, pwGen: false, expiration: false } 
                    },
                    chosen: "shortener"
                })
            }
            else {
                const shortURL = baseURL + '/' + urlCode;
                
                models.Links.create({
                    code: urlCode,
                    shortURL: shortURL,
                    longURL: longURL,
                    created: createdAt
                })
                .then(() => {
                    return res.render('index.ejs', {
                        constructedPassword: null,
                        shortURL: shortURL,
                        errorObject: { 
                            message: "All good", 
                            existsAt: { shortener: false, pwGen: false, expiration: false } 
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
        })
        .catch(() => {
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
    else {
        return res.render('index.ejs', {
            constructedPassword: null,
            shortURL: null,
            errorObject: { 
                message: "The Link you are providing, is not of the right form. Please make sure to copy and paste!", 
                existsAt: { shortener: true, pwGen: false, expiration: false } 
            },
            chosen: "shortener"
        })
    }
}

exports.getExpiration = (req, res, next) => {
    let code = req.body.expireInput;
    
    code = code.trim();
    
    if (code.includes('/')) code = code.split('/')[1];

    models.Links.findOne({ where: { code: code } })
    .then(record => {

        if (!record) {
            return res.render('index.ejs', {
                constructedPassword: null,
                shortURL: null,
                errorObject: { 
                    message: "Expired!", 
                    existsAt: { shortener: false, pwGen: false, expiration: true } 
                },
                chosen: "shortener"
            })
        }

        const daysExist = calcDays(Date.now(), record.createdAt);
        
        if (daysExist > DAYS_LINK_LIVE) {

            models.Links.destroy({ where: { code: code } })
            .then(() => {
                return res.render('index.ejs', {
                    constructedPassword: null,
                    shortURL: null,
                    errorObject: { 
                        message: "Expired!", 
                        existsAt: { shortener: false, pwGen: false, expiration: true } 
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
        else {
            return res.render('index.ejs', {
                constructedPassword: null,
                shortURL: null,
                errorObject: { 
                    message: "Valid!", 
                    existsAt: { shortener: false, pwGen: false, expiration: true } 
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