const { Op } = require("sequelize");
const { Recipient } = require("../models");

exports.index = async (req, res, next) => {
  const { page = 1, limit = 10, search } = req.query;
  const offset = (page - 1) * limit;

  const options = {
    distinct: true,
    order: [["name", "asc"]],
    include: {
      association: "groups",
      attributes: ["id", "name", "description"],
      through: { attributes: [] },
    },
  };

  if (search) {
    options.where = {
      [Op.or]: [
        { name: { [Op.iLike]: `%${search}%` } },
        { phoneNumber: { [Op.iLike]: `%${search}%` } },
      ],
    };
  }

  try {
    const { count: total, rows } = await Recipient.findAndCountAll(options);
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
};

exports.create = async (req, res, next) => {
  try {
    const recipient = await Recipient.create(req.body);
    await recipient.setGroups(req.body.groups);
    res.status(201).json(recipient);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const recipient = await Recipient.findByPk(req.params.id);
    await recipient.setGroups(req.body.groups);

    if (!recipient) {
      const error = new Error("Recipient not found");
      error.status = 404;
      throw error;
    }

    await recipient.update(req.body);
    res.status(200).json(recipient);
  } catch (error) {
    next(error);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    const recipient = await Recipient.findByPk(req.params.id);

    if (!recipient) {
      const error = new Error("Recipient not found");
      error.status = 404;
      throw error;
    }

    await recipient.removeGroups();
    await recipient.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
