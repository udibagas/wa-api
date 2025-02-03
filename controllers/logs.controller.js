const { Log } = require("../models");

exports.index = async (req, res, next) => {
  const { page = 1 } = req.query;
  try {
    // TODO: pagination
    const apps = await Log.findAll({
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
      order: [["createdAt", "desc"]],
    });
    res.status(200).json(apps);
  } catch (error) {
    next(error);
  }
};
