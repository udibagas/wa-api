"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Log.belongsTo(models.Recipient, {
        foreignKey: "RecipientId",
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
      RecipientId: DataTypes.INTEGER,
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
