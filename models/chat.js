"use strict";
const { Model } = require("sequelize");
const sendWhatsAppMessage = require("../utils/sendWhatsAppMessage");

module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      // define association here
    }

    sendMessage() {
      return sendWhatsAppMessage({
        message: this.message,
        caption: this.message,
        phoneNumber: this.to,
        type: this.type,
        file: this.file,
      });
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
      .then((body) => {
        chat.update({ status: "sent", wamid: body.messages[0].id });
      })
      .catch(() => {
        chat.update({ status: "failed" });
      });
  });

  return Chat;
};
