"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class ContactGroup extends Model {
    static associate(models) {
      ContactGroup.belongsTo(models.Contact, {
        foreignKey: "ContactId",
        as: "contact",
      });

      ContactGroup.belongsTo(models.Group, {
        foreignKey: "GroupId",
        as: "group",
      });
    }
  }

  ContactGroup.init(
    {
      ContactId: DataTypes.INTEGER,
      GroupId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "ContactGroup",
      timestamps: false,
    }
  );

  return ContactGroup;
};
