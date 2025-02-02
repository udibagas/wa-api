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
    }

    const body = await sendWhatsAppMessage(payload);
    res.status(200).json(body);
  } catch (error) {
    next(error);
  }
};

exports.sendTemplate = async (req, res, next) => {
  try {
    const { GroupId, message, caption, type } = req.body;

    const payload = { message, caption, type };
    if (type === "image") payload.filePath = req.file.path;

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

    for (const r of group.recipients) {
      console.log("Send to", r.phoneNumber);
      try {
        const res = await sendWhatsAppMessage({
          ...payload,
          phoneNumber: r.phoneNumber,
        });

        console.log("Res =", res);
      } catch (error) {
        console.error(error);
      }
    }

    res.status(200).json({ message: "Message has been sent" });
  } catch (error) {
    next(error);
  }
};
