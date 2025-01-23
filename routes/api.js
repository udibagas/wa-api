const { sendMessage } = require("../controllers/api.controller");
const router = require("express").Router();
const multer = require("multer");
const { login, logout } = require("../controllers/auth.controller");
const upload = multer({ dest: "uploads/" });

router.post("/login", login);
router.post("/logout", logout);
router.post("/sendMessage", upload.single("image"), sendMessage);

module.exports = router;
