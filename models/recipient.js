"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Recipient extends Model {
    static associate(models) {
      Recipient.belongsTo(models.RecipientGroup, {
        foreignKey: "GroupId",
        as: "group",
      });
    }
  }

  Recipient.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Name is required",
          },
          notEmpty: {
            msg: "Name is required",
          },
        },
      },
      phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Phone number already exists",
        },
        validate: {
          notNull: {
            msg: "Phone number is required",
          },
          notEmpty: {
            msg: "Phone number is required",
          },
        },
      },
      GroupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Group is required",
          },
          notEmpty: {
            msg: "Group is required",
          },
        },
      },
      dateOfBirth: DataTypes.DATEONLY,
    },
    {
      sequelize,
      modelName: "Recipient",
    }
  );

  return Recipient;
};
