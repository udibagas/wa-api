const { sendMessage, sendTemplate } = require("../controllers/api.controller");
const router = require("express").Router();
const multer = require("multer");
const { login, logout, me } = require("../controllers/auth.controller");
const { auth } = require("../middlewares/auth.middleware");
const upload = multer({ dest: "uploads/" });

router.post("/login", login);

router.use(auth);
router.post("/logout", logout);
router.get("/me", me);
router.post("/sendMessage", upload.single("image"), sendMessage);
router.post("/sendTemplate", sendTemplate);
router.use("/users", require("./users"));
router.use("/apps", require("./apps"));
router.use("/groups", require("./groups"));
router.use("/recipients", require("./recipients"));
router.use("/message-templates", require("./message-templates"));

module.exports = router;
