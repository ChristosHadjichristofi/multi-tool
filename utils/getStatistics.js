// require models
const sequelize = require('../utils/database');
var initModels = require("../models/init-models");
var models = initModels(sequelize);
// end of require models

module.exports = () => {

    return new Promise((resolve, reject) => {

        models.Statistics.findOne({ where: { id: 1 } })
        .then(record => {
            if (!record) models.Statistics.create().then(stats => resolve(stats)).catch(err => resolve(null))
            else resolve(record);
        })
    })
}