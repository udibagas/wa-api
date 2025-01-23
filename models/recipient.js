"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Recipient extends Model {
    static associate(models) {
      Recipient.belongsTo(models.Group, {
        foreignKey: "GroupId",
        as: "group",
      });
    }
  }

  Recipient.init(
    {
      name: DataTypes.STRING,
      phoneNumber: DataTypes.STRING,
      GroupId: DataTypes.INTEGER,
      dateOfBirth: DataTypes.DATEONLY,
    },
    {
      sequelize,
      modelName: "Recipient",
    }
  );

  return Recipient;
};
