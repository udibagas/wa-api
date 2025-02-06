const { Group } = require("../models");

exports.index = async (req, res, next) => {
  try {
    const groups = await Group.findAll({
      order: [["id", "asc"]],
    });
    res.status(200).json(groups);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const group = await Group.create(req.body);
    res.status(201).json(group);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id);

    if (!group) {
      const error = new Error("Group not found");
      error.status = 404;
      throw error;
    }

    await group.update(req.body);
    res.status(200).json(group);
  } catch (error) {
    next(error);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    const group = await Group.findByPk(req.params.id);

    if (!group) {
      const error = new Error("Group not found");
      error.status = 404;
      throw error;
    }

    await group.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
