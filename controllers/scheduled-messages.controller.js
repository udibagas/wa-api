const { ScheduledMessage, Recipient } = require("../models");

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
  const { name, message, groups, recipients, time, recurring } = req.body;
  const target = [];

  if (recipients?.length > 0) {
    target.push(...recipients);
  }

  if (groups?.length > 0) {
    const res = await Recipient.findAll({
      include: {
        association: "groups",
        where: {
          id: { [Op.in]: groups },
        },
      },
    });

    if (res.length > 0) {
      target.push(...res.map((r) => r.id));
    }
  }

  const uniqueRecipients = Array.from(
    new Map(target.map((item) => [item.id, item])).values()
  );

  try {
    const data = await ScheduledMessage.create({
      name,
      message,
      time,
      recurring,
      recipients: uniqueRecipients,
      UserId: req.user.id,
    });

    res.status(201).json(data);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  const { name, message, groups, recipients, time, recurring } = req.body;
  const target = [];

  if (recipients?.length > 0) {
    target.push(...recipients);
  }

  if (groups?.length > 0) {
    const res = await Recipient.findAll({
      include: {
        association: "groups",
        where: {
          id: { [Op.in]: groups },
        },
      },
    });

    if (res.length > 0) {
      target.push(...res.map((r) => r.id));
    }
  }

  const uniqueRecipients = Array.from(
    new Map(target.map((item) => [item.id, item])).values()
  );

  try {
    const data = await ScheduledMessage.findByPk(req.params.id);

    if (!data) {
      const error = new Error("Data not found");
      error.status = 404;
      throw error;
    }

    await data.update({
      name,
      message,
      time,
      recurring,
      recipients: uniqueRecipients,
    });

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

exports.destroy = async (req, res, next) => {
  try {
    const app = await ScheduledMessage.findByPk(req.params.id);

    if (!app) {
      const error = new Error("Data not found");
      error.status = 404;
      throw error;
    }

    await app.destroy();
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
