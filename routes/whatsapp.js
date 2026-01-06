const { auth } = require("../middlewares/auth.middleware");
const router = require("express").Router();
const whatsappService = require("../services/whatsapps.service");
const { Log, MessageTemplate, Contact } = require("../models");

router
  .use(auth)
  // send individual message
  .post("/send", async (req, res, next) => {
    try {
      const {
        message,
        caption,
        phoneNumber,
        type,
        templateName,
        components = [],
      } = req.body;

      if (type === "text") {
        whatsappService.sendTextMessage(phoneNumber, message);
      }

      res.status(200).json(body);
    } catch (error) {
      next(error);
    }
  })

  // send bulk message
  .post("/bulk-send", async (req, res, next) => {
    try {
      const {
        groups = [],
        message,
        caption,
        type,
        MessageTemplateId,
        contacts = [],
        file,
        templateName,
      } = req.body;

      let template = null;

      if (MessageTemplateId) {
        template = await MessageTemplate.findByPk(MessageTemplateId);
        if (!template) {
          const error = new Error("Template not found");
          error.status = 404;
          throw error;
        }
      }

      const AppId = template?.appId ?? null;

      const payload = {
        type,
        file,
        message,
        caption,
        templateName,
      };

      const target = [];

      if (contacts.length) {
        const res = await Contact.findAll({
          where: {
            id: { [Op.in]: contacts },
          },
        });

        target.push(...res);
      }

      if (groups.length) {
        const res = await Contact.findAll({
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

      // todo: handle in query
      const uniqueContacts = Array.from(
        new Map(target.map((item) => [item.id, item])).values()
      );

      for (const { id, name, phoneNumber } of uniqueContacts) {
        console.log("Send to", phoneNumber);
        let status = "success"; // default status
        let response = null; // default response

        // sendWhatsAppMessage({
        //   ...payload,
        //   message: message.replaceAll("{{name}}", name),
        //   caption: caption.replaceAll("{{name}}", name),
        //   phoneNumber,
        // })

        whatsappService
          .sendTextMessage(phoneNumber, message)
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
              ContactId: id,
              response,
              status,
            });
          });
      }

      res.status(200).json({ message: "Message has been sent" });
    } catch (error) {
      next(error);
    }
  });
