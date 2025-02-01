"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RecipientGroup extends Model {
    static associate(models) {
      RecipientGroup.belongsTo(models.Recipient, {
        foreignKey: "RecipientId",
        as: "recipient",
      });

      RecipientGroup.belongsTo(models.Group, {
        foreignKey: "GroupId",
        as: "group",
      });
    }
  }

  RecipientGroup.init(
    {
      RecipientId: DataTypes.INTEGER,
      GroupId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "RecipientGroup",
      timestamps: false,
    }
  );

  return RecipientGroup;
};
