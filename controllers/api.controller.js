const { Op } = require("sequelize");
const { Group, Recipient, Log } = require("../models");
const sendWhatsAppMessage = require("../utils/sendWhatsAppMessage");

exports.sendMessage = async (req, res, next) => {
  try {
    const {
      message,
      caption,
      phoneNumber,
      type,
      templateName,
      components = [],
    } = req.body;

    const payload = {
      message,
      caption,
      phoneNumber,
      type,
      templateName,
      components,
    };

    if (type === "image") {
      payload.filePath = req.file.path;
      payload.fileType = req.file.mimetype;
    }

    const body = await sendWhatsAppMessage(payload);
    res.status(200).json(body);
  } catch (error) {
    next(error);
  }
};

exports.sendTemplate = async (req, res, next) => {
  try {
    const {
      groups = [],
      message,
      caption,
      type,
      filePath,
      fileType,
      AppId,
      MessageTemplateId,
    } = req.body;

    const payload = { message, caption, type, filePath, fileType };

    const recipients = await Recipient.findAll({
      include: {
        association: "groups",
        where: {
          id: { [Op.in]: groups },
        },
      },
    });

    if (!recipients.length) {
      const error = new Error("Group(s) has no recipients");
      error.status = 400;
      throw error;
    }

    for (const r of recipients) {
      console.log("Send to", r.phoneNumber);
      try {
        sendWhatsAppMessage({
          ...payload,
          message: message.replaceAll("{{name}}", r.name),
          caption: caption.replaceAll("{{name}}", r.name),
          phoneNumber: r.phoneNumber,
        }).then((res) => {
          console.log("Res =", res);

          Log.create({
            AppId,
            MessageTemplateId,
            RecipientId: r.id,
            response: res,
            status: "success",
          });
        });
      } catch (error) {
        console.error("INI ERROR", error);

        Log.create({
          AppId,
          MessageTemplateId,
          RecipientId: r.id,
          response: error,
          status: "failed",
        });
      }
    }

    res.status(200).json({ message: "Message has been sent" });
  } catch (error) {
    next(error);
  }
};
