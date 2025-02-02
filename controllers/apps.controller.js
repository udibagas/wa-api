const { App } = require("../models");

exports.index = async (req, res, next) => {
  try {
    const apps = await App.findAll({
      order: [["name", "asc"]],
    });
    res.status(200).json(apps);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const app = await App.create(req.body);
    res.status(201).json(app);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const app = await App.findByPk(req.params.id);

    if (!app) {
      const error = new Error("App not found");
      error.status = 404;
      throw error;
    }

    await app.update(req.body);
    res.status(200).json(app);
  } catch (error) {
    next(error);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    const app = await App.findByPk(req.params.id);

    if (!app) {
      const error = new Error("App not found");
      error.status = 404;
      throw error;
    }

    await app.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
