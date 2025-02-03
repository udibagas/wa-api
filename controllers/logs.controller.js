const { Log } = require("../models");

exports.index = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  const options = {
    distinct: true,
    order: [["createdAt", "desc"]],
    limit,
    offset,
    include: [
      {
        association: "recipient",
        attributes: ["name", "phoneNumber"],
      },
      {
        association: "app",
        attributes: ["name"],
      },
      {
        association: "messageTemplate",
        attributes: ["name"],
      },
    ],
  };

  try {
    const { count: total, rows } = await Log.findAndCountAll(options);
    res.status(200).json({
      total,
      page: +page,
      rows,
      from: offset + 1,
      to: offset + rows.length,
    });
  } catch (error) {
    next(error);
  }
};
