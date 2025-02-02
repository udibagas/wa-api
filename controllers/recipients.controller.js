const { Recipient } = require("../models");

exports.index = async (req, res, next) => {
  try {
    const recipients = await Recipient.findAll({
      include: {
        association: "groups",
        attributes: ["id", "name", "description"],
        through: { attributes: [] },
      },
    });
    res.status(200).json(recipients);
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
