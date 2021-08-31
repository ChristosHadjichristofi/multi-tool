var DataTypes = require("sequelize").DataTypes;
var _Links = require("./Links");
var _Statistics = require("./Statistics");

function initModels(sequelize) {
  var Links = _Links(sequelize, DataTypes);
  var Statistics = _Statistics(sequelize, DataTypes);

  return {
    Links,
    Statistics,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;