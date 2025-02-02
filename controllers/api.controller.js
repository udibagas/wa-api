const { Group, MessageTemplate } = require("../models");
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

    const body = await sendWhatsAppMessage({
      message,
      caption,
      phoneNumber,
      type,
      templateName,
      components,
    });
    res.status(200).json(body);
  } catch (error) {
    next(error);
  }
};

exports.sendTemplate = async (req, res, next) => {
  try {
    const { GroupId, MessageTemplateId } = req.body;

    const group = await Group.findByPk(GroupId, {
      include: "recipients",
    });

    if (!group) {
      const error = new Error("Group not found");
      error.status = 404;
      throw error;
    }

    if (!group.recipients.length) {
      const error = new Error("Group has no recipients");
      error.status = 400;
      throw error;
    }

    const messageTemplate = await MessageTemplate.findByPk(MessageTemplateId);

    if (!messageTemplate) {
      const error = new Error("Message Template not found");
      error.status = 404;
      throw error;
    }

    const { body } = messageTemplate;

    group.recipients.forEach(async (recipient) => {
      sendWhatsAppMessage({
        message: body,
        phoneNumber: recipient.phoneNumber,
      })
        .then(() => {
          console.log("Message sent to", recipient.phoneNumber);
        })
        .catch((error) => {
          console.error(
            "Error sending message to",
            recipient.phoneNumber,
            error
          );
        });
    });

    res.status(200).json({ message: "Message has been sent" });
  } catch (error) {
    next(error);
  }
};
