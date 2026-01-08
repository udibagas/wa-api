"use strict";
const { Model } = require("sequelize");
const whatsappsService = require("../services/whatsapps.service");
// const sendWhatsAppMessage = require("../utils/sendWhatsAppMessage");

module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      // define association here
    }

    sendMessage() {
      // return sendWhatsAppMessage({
      //   message: this.message,
      //   caption: this.message,
      //   phoneNumber: this.to,
      //   type: this.type,
      //   file: this.file,
      // });
      return whatsappsService.sendMessage(this.to, this.message);
    }
  }

  Chat.init(
    {
      from: DataTypes.STRING,
      to: DataTypes.STRING,
      message: DataTypes.TEXT,
      type: DataTypes.STRING,
      file: DataTypes.JSON,
      status: DataTypes.STRING,
      wamid: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Chat",
    }
  );

  Chat.afterCreate((chat) => {
    chat
      .sendMessage()
      .then(({ success, message }) => {
        chat.update({ status: "delivered" });
      })
      .catch(() => {
        chat.update({ status: "failed" });
      });
  });

  return Chat;
};
