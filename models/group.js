"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    static associate(models) {
      Group.belongsToMany(models.Contact, {
        through: models.ContactGroup,
        foreignKey: "GroupId",
        as: "recipients",
      });

      Group.hasMany(models.ContactGroup, {
        foreignKey: "GroupId",
        as: "recipientGroups",
        onDelete: "CASCADE",
      });
    }
  }

  Group.init(
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
      description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Group",
      timestamps: false,
    }
  );
  return Group;
};
