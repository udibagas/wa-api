const { Op } = require("sequelize");
const { Log } = require("../models");
const { auth } = require("../middlewares/auth.middleware");
const router = require("express").Router();

router
  .use(auth)
  .get("/", async (req, res, next) => {
    const { page = 1, limit = 10, search, status } = req.query;
    const offset = (page - 1) * limit;

    const options = {
      where: {},
      distinct: true,
      order: [["createdAt", "desc"]],
      limit,
      offset,
      include: [
        {
          association: "recipient",
          attributes: ["name", "phoneNumber"],
        },
        {
          association: "app",
          attributes: ["name"],
        },
        {
          association: "messageTemplate",
          attributes: ["name"],
        },
        {
          association: "user",
          attributes: ["id", "name"],
        },
      ],
    };

    // if (req.user.role !== "admin") {
    //   options.where = {
    //     ...options.where,
    //     "$app.UserId$": req.user.id,
    //   };
    // }

    if (search) {
      options.where = {
        ...options.where,
        [Op.or]: {
          "$messageTemplate.name$": { [Op.iLike]: `%${search}%` },
          "$app.name$": { [Op.iLike]: `%${search}%` },
          "$recipient.name$": { [Op.iLike]: `%${search}%` },
          "$recipient.phoneNumber$": { [Op.iLike]: `%${search}%` },
        },
      };
    }

    if (status && status !== "all") {
      options.where = {
        ...options.where,
        status,
      };
    }

    try {
      const { count: total, rows } = await Log.findAndCountAll(options);
      res.status(200).json({
        total,
        page: +page,
        rows,
        from: offset + 1,
        to: offset + rows.length,
      });
    } catch (error) {
      next(error);
    }
  })

  .delete("/", async (req, res, next) => {
    try {
      await Log.destroy({ where: {} });
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
