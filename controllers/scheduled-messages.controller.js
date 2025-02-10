const { ScheduledMessage } = require("../models");

exports.index = async (req, res, next) => {
  try {
    const data = await ScheduledMessage.findAll({
      order: [["updatedAt", "asc"]],
    });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const data = await ScheduledMessage.create({
      ...req.body,
      UserId: req.user.id,
    });
    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const data = await ScheduledMessage.findByPk(req.params.id);

    if (!data) {
      const error = new Error("ScheduledMessage not found");
      error.status = 404;
      throw error;
    }

    await data.update(req.body);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    const app = await ScheduledMessage.findByPk(req.params.id);

    if (!app) {
      const error = new Error("ScheduledMessage not found");
      error.status = 404;
      throw error;
    }

    await app.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
