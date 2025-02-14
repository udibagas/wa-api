const { MessageTemplate, App } = require("../models");

exports.index = async (req, res, next) => {
  try {
    const messageTemplates = await MessageTemplate.findAll({
      order: [["id", "asc"]],
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

    let status = messageTemplate.status;

    if (
      messageTemplate.name != req.body.name ||
      messageTemplate.body != req.body.body
    ) {
      status = "draft";
    }

    await messageTemplate.update({ ...req.body, status });
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

exports.submit = (req, res, next) => {
  MessageTemplate.findByPk(req.params.id)
    .then((messageTemplate) => {
      if (!messageTemplate) {
        const error = new Error("Message Template not found");
        error.status = 404;
        throw error;
      }

      messageTemplate.status = "submitted";
      return messageTemplate.save();
    })
    .then((messageTemplate) => {
      res.status(200).json(messageTemplate);
    })
    .catch(next);
};
