const { sendMessage, sendTemplate } = require("../controllers/api.controller");
const router = require("express").Router();

router.use(require("./auth"));
router.use(require("../middlewares/auth.middleware").auth);

// todo: hapus ini
router.post("/sendMessage", sendMessage);
router.post("/sendTemplate", sendTemplate);

router.use("/users", require("./users"));
router.use("/apps", require("./apps"));
router.use("/groups", require("./groups"));
router.use("/contacts", require("./contacts"));
router.use("/message-templates", require("./message-templates"));
router.use("/scheduled-messages", require("./scheduled-messages"));
router.use("/chats", require("./chats"));
router.use("/logs", require("./logs"));
router.use("/stats", require("./stats"));
router.use("/file", require("./file"));

module.exports = router;
