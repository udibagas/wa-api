"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RecipientGroup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RecipientGroup.hasMany(models.Recipient, {
        foreignKey: "GroupId",
        as: "recipients",
      });
    }
  }

  RecipientGroup.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "RecipientGroup",
    }
  );

  return RecipientGroup;
};
