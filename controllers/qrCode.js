const generateMessageObj = require('../utils/generateMessageObj');
const qr = require("qrcode");
const validUrl = require('valid-url');

exports.postGenerateQR = (req, res, next) => {
    const url = req.body.urlForQR;

    if (validUrl.isUri(url)) {
        qr.toDataURL(url, function (err, QRcode) {
 
            if (err) {
                return res.render('index.ejs', {
                    constructedPassword: null,
                    shortURL: null,
                    qrImg: null,
                    errorObject: generateMessageObj.errorAt("qrCode", "Something went wrong. Please try again later!"),
                    chosen: "qrCode"
                })
            }

            return res.render('index.ejs', {
                constructedPassword: null,
                shortURL: null,
                qrImg: QRcode,
                errorObject: generateMessageObj.noError(),
                chosen: "qrCode"
            })
        })
    }
    else {
        return res.render('index.ejs', {
            constructedPassword: null,
            shortURL: null,
            qrImg: null,
            errorObject: generateMessageObj.errorAt("qrCode", "The Link you are providing, is not of the right form. Please make sure to copy and paste!"),
            chosen: "qrCode"
        })
    }
}