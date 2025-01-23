const { User } = require("../models");

exports.index = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    await user.update(req.body);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    await user.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
