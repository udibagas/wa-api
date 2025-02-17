const { Contact, Log } = require("../models");

exports.stats = async (req, res, next) => {
  try {
    const recipientCount = await Contact.count();
    const messageCount = await Log.count();
    const successMessageCount = await Log.count({
      where: { status: "success" },
    });

    const failedMessageCount = messageCount - successMessageCount;
    const successRate =
      ((messageCount - failedMessageCount) / messageCount) * 100;

    res.status(200).json({
      recipientCount,
      messageCount,
      successMessageCount,
      failedMessageCount,
      successRate,
    });
  } catch (error) {
    next(error);
  }
};
