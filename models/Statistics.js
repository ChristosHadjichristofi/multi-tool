const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Statistics', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    shortened_links: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    clicked_links: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'Statistics',
    schema: 'url-shortener-schema',
    timestamps: true,
    indexes: [
      {
        name: "Statistics_pkey",
        unique: true,
        fields: [
          { name: "id" },
        ]
      },
    ]
  });
};