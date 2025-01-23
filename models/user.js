"use strict";
const bcrypt = require("bcrypt");
const { Model } = require("sequelize");
const jwt = require("jsonwebtoken");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    comparePassword(password) {
      return bcrypt.compareSync(password, this.password);
    }

    generateAuthToken() {
      return jwt.sign({ ...this }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });
    }
  }

  User.init(
    {
      name: {
        allowNull: false,
        type: DataTypes.STRING,
        validate: {
          notNull: { msg: "Name is required" },
          notEmpty: { msg: "Name is required" },
        },
      },
      email: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: { msg: "Email already exists" },
        validate: {
          isEmail: { msg: "Invalid email format" },
          notNull: { msg: "Email is required" },
          notEmpty: { msg: "Email is required" },
        },
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING,
        set(value) {
          if (!value) return;
          const saltRounds = 10;
          const hash = bcrypt.hashSync(value, saltRounds);
          this.setDataValue("password", hash);
        },
        validate: {
          notNull: { msg: "Password is required" },
          notEmpty: { msg: "Password is required" },
        },
      },
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: { exclude: ["password"] },
      },
    }
  );

  return User;
};
