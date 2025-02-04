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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: { msg: "Name is required" },
          notEmpty: { msg: "Name is required" },
        },
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: { msg: "Body is required" },
          notEmpty: { msg: "Body is required" },
          len: {
            args: [1, 4096],
            msg: "Body length must be between 1 and 4096 characters",
          },
        },
      },
      components: DataTypes.JSON,
      appId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "App is required" },
          notEmpty: { msg: "App is required" },
        },
      },
    },
    {
      sequelize,
      modelName: "MessageTemplate",
    }
  );

  return MessageTemplate;
};
