const { Op, QueryTypes, where } = require("sequelize");
const { Chat, Recipient, sequelize } = require("../models");

exports.index = async (req, res, next) => {
  const { phoneNumber } = req.query;
  try {
    const data = await Chat.findAll({
      order: [["createdAt", "asc"]],
      where: {
        [Op.or]: [{ from: phoneNumber }, { to: phoneNumber }],
      },
    });
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const app = await Chat.create({
      ...req.body,
      from: process.env.WA_NUMBER || "6285138388850",
      type: req.body.type || "text",
      status: "pending",
    });
    res.status(201).json(app);
  } catch (error) {
    next(error);
  }
};

exports.lastestMessage = async (req, res, next) => {
  const { phoneNumber } = req.query;
  try {
    const data = await Chat.findOne({
      order: [["createdAt", "desc"]],
      where: { [Op.or]: [{ from: phoneNumber }, { to: phoneNumber }] },
    });

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
