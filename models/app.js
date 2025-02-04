"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class App extends Model {
    static associate(models) {
      App.hasMany(models.MessageTemplate, {
        foreignKey: "appId",
        onDelete: "SET NULL",
      });

      App.hasMany(models.Log, {
        foreignKey: "AppId",
        onDelete: "SET NULL",
      });

      App.belongsTo(models.User, {
        foreignKey: "UserId",
        onDelete: "CASCADE",
      });
    }
  }

  App.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: "Name is required",
          },
          notEmpty: {
            msg: "Name is required",
          },
        },
      },
      UserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: { msg: "User is required" },
          notEmpty: { msg: "User is required" },
        },
      },
      description: DataTypes.TEXT,
      token: DataTypes.TEXT,
      status: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "App",
    }
  );

  return App;
};
