"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Recipient extends Model {
    static associate(models) {
      Recipient.belongsToMany(models.Group, {
        through: models.RecipientGroup,
        foreignKey: "RecipientId",
        as: "groups",
      });
    }

    get age() {
      if (!this.dateOfBirth) return null;

      const today = new Date();
      const birthDate = new Date(this.dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const month = today.getMonth() - birthDate.getMonth();

      if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        age -= 1;
      }

      return age;
    }

    toJSON() {
      return { ...this.get(), age: this.age };
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
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        validate: {
          isDate: { msg: "Invalid date format" },
        },
      },
    },
    {
      sequelize,
      modelName: "Recipient",
    }
  );

  return Recipient;
};
