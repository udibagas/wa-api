"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Log extends Model {
    static associate(models) {
      Log.belongsTo(models.Contact, {
        foreignKey: "ContactId",
        as: "recipient",
      });

      Log.belongsTo(models.App, {
        foreignKey: "AppId",
        as: "app",
      });

      Log.belongsTo(models.MessageTemplate, {
        foreignKey: "MessageTemplateId",
        as: "messageTemplate",
      });
    }
  }

  Log.init(
    {
      ContactId: DataTypes.INTEGER,
      AppId: DataTypes.INTEGER,
      MessageTemplateId: DataTypes.INTEGER,
      response: DataTypes.JSON,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Log",
      updatedAt: false,
    }
  );

  return Log;
};
