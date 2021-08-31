// require models
const sequelize = require('../utils/database');
var initModels = require("../models/init-models");
var models = initModels(sequelize);
// end of require models
const generateMessageObj = require('../utils/generateMessageObj');
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
        errorObject = generateMessageObj.errorAt("shortener", "Input cannot be empty!");
    }

    if (!validUrl.isUri(baseURL)) {
        errorOccured = true;
        errorObject = generateMessageObj.errorAt("shortener", "Invalid Base URL!");
    }
    
    if (errorOccured) {
        return res.render('index.ejs', {
            constructedPassword: null,
            shortURL: null,
            qrImg: null,
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
                    qrImg: null,
                    errorObject: generateMessageObj.noError(),
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
                        qrImg: null,
                        errorObject: generateMessageObj.noError(),
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
        })
        .catch(() => {
            return res.render('index.ejs', {
                constructedPassword: null,
                shortURL: null,
                qrImg: null,
                errorObject: generateMessageObj.errorAt("shortener", "Something went wrong, please try again later!"),
                chosen: "shortener"
            })
        })
    } 
    else {
        return res.render('index.ejs', {
            constructedPassword: null,
            shortURL: null,
            qrImg: null,
            errorObject: generateMessageObj.errorAt("shortener", "The Link you are providing, is not of the right form. Please make sure to copy and paste!"),
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
                qrImg: null,
                errorObject: generateMessageObj.errorAt("expiration", "Expired!"),
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
                    qrImg: null,
                    errorObject: generateMessageObj.errorAt("expiration", "Expired!"),
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
        else {
            return res.render('index.ejs', {
                constructedPassword: null,
                shortURL: null,
                qrImg: null,
                errorObject: generateMessageObj.errorAt("expiration", "Valid!"),
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