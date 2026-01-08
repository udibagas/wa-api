const { auth } = require("../middlewares/auth.middleware");
const router = require("express").Router();
const whatsappService = require("../services/whatsapps.service");
const { Log, MessageTemplate, Contact } = require("../models");
const { Op } = require("sequelize");

router
  .use(auth)
  // send individual message
  .post("/send", async (req, res, next) => {
    try {
      const { message, phoneNumber, type, file } = req.body;

      const result = await whatsappService.sendMessage(
        phoneNumber,
        message,
        type,
        file
      );

      res.status(200).json(result);
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
        type,
        MessageTemplateId,
        contacts = [],
        file,
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
        let status = "success"; // default status
        let response = null; // default response

        whatsappService
          .sendMessage(
            phoneNumber,
            message.replaceAll("{{name}}", name),
            type,
            file
          )
          .then((res) => {
            response = res;
          })
          .catch((error) => {
            status = "failed";
            response = error;
          })
          .finally(() => {
            Log.create({
              UserId: req.user.id,
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

module.exports = router;
