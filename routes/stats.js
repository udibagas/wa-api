const router = require("express").Router();
const { auth } = require("../middlewares/auth.middleware");
const { Contact, Log } = require("../models");

router.use(auth).get("/", async (req, res, next) => {
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
});

module.exports = router;
