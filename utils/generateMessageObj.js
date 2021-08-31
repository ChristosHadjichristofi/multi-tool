exports.noError = () => {
    return { 
        message: "All good", 
        existsAt: { shortener: false, pwGen: false, expiration: false, qrCode: false }
    };
}

exports.errorAt = (name, message) => {

    let existsAt = {};

    if (name == "shortener") existsAt = { shortener: true, pwGen: false, expiration: false, qrCode: false }
    else if (name == "pwGen") existsAt = { shortener: false, pwGen: true, expiration: false, qrCode: false }
    else if (name == "expiration") existsAt = { shortener: false, pwGen: false, expiration: true, qrCode: false }
    else if (name == "qrCode") existsAt = { shortener: false, pwGen: false, expiration: false, qrCode: true }

    return {
        message: message,
        existsAt: existsAt
    };
}