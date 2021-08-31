const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Links', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING(70),
      allowNull: false
    },
    shortURL: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    longURL: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Links',
    schema: 'url-shortener-schema',
    timestamps: true,
    indexes: [
      {
        name: "Links_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};