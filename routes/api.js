const { sendMessage } = require("../controllers/api.controller");
const router = require("express").Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post("/sendMessage", upload.single("image"), sendMessage);

module.exports = router;
