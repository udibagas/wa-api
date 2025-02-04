const { MessageTemplate, App } = require("../models");

exports.index = async (req, res, next) => {
  try {
    const messageTemplates = await MessageTemplate.findAll({
      order: [["name", "asc"]],
      include: {
        model: App,
        attributes: ["id", "name"],
      },
    });
    res.status(200).json(messageTemplates);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const messageTemplate = await MessageTemplate.create(req.body);
    res.status(201).json(messageTemplate);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const messageTemplate = await MessageTemplate.findByPk(req.params.id);

    if (!messageTemplate) {
      const error = new Error("Message Template not found");
      error.status = 404;
      throw error;
    }

    await messageTemplate.update(req.body);
    res.status(200).json(messageTemplate);
  } catch (error) {
    next(error);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    const messageTemplate = await MessageTemplate.findByPk(req.params.id);

    if (!messageTemplate) {
      const error = new Error("Message Template not found");
      error.status = 404;
      throw error;
    }

    await messageTemplate.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
