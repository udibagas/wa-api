const { Recipient } = require("../models");

exports.index = async (req, res, next) => {
  try {
    const recipients = await Recipient.findAll();
    res.status(200).json(recipients);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const recipient = await Recipient.create(req.body);
    res.status(201).json(recipient);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const app = await Recipient.findByPk(req.params.id);

    if (!app) {
      const error = new Error("Recipient not found");
      error.status = 404;
      throw error;
    }

    await app.update(req.body);
    res.status(200).json(recipient);
  } catch (error) {
    next(error);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    const app = await Recipient.findByPk(req.params.id);

    if (!app) {
      const error = new Error("Recipient not found");
      error.status = 404;
      throw error;
    }

    await app.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
