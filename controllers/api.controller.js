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
    const payload = { type, file, message, caption };
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
      const error = new Error("No target selected");
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

    for (const { id, name, phoneNumber } of uniqueRecipients) {
      console.log("Send to", phoneNumber);
      let status = "success"; // default status
      let response = null; // default response

      sendWhatsAppMessage({
        ...payload,
        message: message.replaceAll("{{name}}", name),
        caption: caption.replaceAll("{{name}}", name),
        phoneNumber,
      })
        .then((res) => {
          console.log(res);
          response = res;
        })
        .catch((error) => {
          console.error(error);
          status = "failed";
          response = error;
        })
        .finally(() => {
          Log.create({
            AppId,
            MessageTemplateId,
            RecipientId: id,
            response,
            status,
          });
        });
    }

    res.status(200).json({ message: "Message has been sent" });
  } catch (error) {
    next(error);
  }
};
