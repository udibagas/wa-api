const { Op } = require("sequelize");
const { MessageTemplate, Recipient, Log } = require("../models");
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
      MessageTemplateId,
      recipients = [],
      file,
    } = req.body;

    const template = await MessageTemplate.findByPk(MessageTemplateId);

    if (!template) {
      const error = new Error("Template not found");
      error.status = 404;
      throw error;
    }

    const AppId = template.appId;
    const payload = { message, caption, type, file };

    const target = [];

    if (recipients.length) {
      const res = await Recipient.findAll({
        where: {
          id: { [Op.in]: recipients },
        },
      });

      target.push(...res);
    }

    if (groups.length) {
      const res = await Recipient.findAll({
        include: {
          association: "groups",
          where: {
            id: { [Op.in]: groups },
          },
        },
      });

      target.push(...res);
    }

    if (!target.length) {
      const error = new Error("Group(s) has no recipients");
      error.status = 400;
      throw error;
    }

    // slower method
    // const uniqueRecipients = target.filter(
    //   (r, i, self) => self.findIndex((t) => t.id === r.id) === i
    // );

    // faster method
    // todo: handle in query
    const uniqueRecipients = Array.from(
      new Map(target.map((item) => [item.id, item])).values()
    );

    for (const r of uniqueRecipients) {
      console.log("Send to", r.phoneNumber);

      sendWhatsAppMessage({
        ...payload,
        message: message.replaceAll("{{name}}", r.name),
        caption: caption.replaceAll("{{name}}", r.name),
        phoneNumber: r.phoneNumber,
        fileName: fileName,
      })
        .then((res) => {
          Log.create({
            AppId,
            MessageTemplateId,
            RecipientId: r.id,
            response: res,
            status: "success",
          }).catch((err) => {
            console.error(err.message);
          });
        })
        .catch((error) => {
          Log.create({
            AppId,
            MessageTemplateId,
            RecipientId: r.id,
            response: error,
            status: "failed",
          }).catch((err) => {
            console.error(err.message);
          });
        });
    }

    res.status(200).json({ message: "Message has been sent" });
  } catch (error) {
    next(error);
  }
};
