"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class MessageTemplate extends Model {
    static associate(models) {
      MessageTemplate.belongsTo(models.App, {
        foreignKey: "appId",
        onDelete: "SET NULL",
      });
    }
  }

  MessageTemplate.init(
    {
      name: DataTypes.STRING,
      body: DataTypes.TEXT,
      components: DataTypes.JSON,
      appId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "MessageTemplate",
    }
  );

  return MessageTemplate;
};
