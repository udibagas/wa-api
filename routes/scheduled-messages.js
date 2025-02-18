const { auth } = require("../middlewares/auth.middleware");
const { ScheduledMessage, Contact } = require("../models");
const router = require("express").Router();

router
  .use(auth)
  .get("/", async (req, res, next) => {
    try {
      const data = await ScheduledMessage.findAll({
        order: [["updatedAt", "asc"]],
      });
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  })

  .post("/", async (req, res, next) => {
    const { name, message, groups, recipients, time, recurring } = req.body;
    const target = [];

    if (recipients?.length > 0) {
      target.push(...recipients);
    }

    if (groups?.length > 0) {
      const res = await Contact.findAll({
        include: {
          association: "groups",
          where: {
            id: { [Op.in]: groups },
          },
        },
      });

      if (res.length > 0) {
        target.push(...res.map((r) => r.id));
      }
    }

    const uniqueContacts = Array.from(new Set(target));

    try {
      const data = await ScheduledMessage.create({
        name,
        message,
        time,
        recurring,
        recipients: uniqueContacts,
        UserId: req.user.id,
      });

      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  })

  .put("/:id", async (req, res, next) => {
    const { name, message, groups, recipients, time, recurring } = req.body;
    const target = [];

    if (recipients?.length > 0) {
      target.push(...recipients);
    }

    if (groups?.length > 0) {
      const res = await Contact.findAll({
        include: {
          association: "groups",
          where: {
            id: { [Op.in]: groups },
          },
        },
      });

      if (res.length > 0) {
        target.push(...res.map((r) => r.id));
      }
    }

    console.log(target);

    const uniqueContacts = Array.from(new Set(target));

    console.log(uniqueContacts);

    try {
      const data = await ScheduledMessage.findByPk(req.params.id);

      if (!data) {
        const error = new Error("Data not found");
        error.status = 404;
        throw error;
      }

      await data.update({
        name,
        message,
        time,
        recurring,
        recipients: uniqueContacts,
      });

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  })

  .delete("/:id", async (req, res, next) => {
    try {
      const app = await ScheduledMessage.findByPk(req.params.id);

      if (!app) {
        const error = new Error("Data not found");
        error.status = 404;
        throw error;
      }

      await app.destroy();
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
