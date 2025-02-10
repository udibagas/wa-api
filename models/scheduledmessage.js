"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ScheduledMessage extends Model {
    static associate(models) {
      ScheduledMessage.belongsTo(models.User);
    }
  }

  ScheduledMessage.init(
    {
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      file: DataTypes.JSON,
      recipients: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      recurring: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "ScheduledMessage",
    }
  );

  return ScheduledMessage;
};
