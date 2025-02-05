const { sendMessage, sendTemplate } = require("../controllers/api.controller");
const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const moment = require("moment");
const { login, logout, me } = require("../controllers/auth.controller");
const { index, clear } = require("../controllers/logs.controller");

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const ymd = moment().format("YYYY/MM/DD");
    const uploadPath = `uploads/${ymd}`;
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ymdhis = moment().format("YYYYMMDDHHmmssSSS");
    const ext = path.extname(file.originalname);
    cb(null, ymdhis + ext);
  },
});

const upload = multer({ storage: storage });

router.post("/login", login);
router.use(require("../middlewares/auth.middleware").auth);
router.post("/logout", logout);
router.get("/me", me);

router.post("/upload", upload.single("file"), (req, res) => {
  const protocol = req.protocol;
  const host = req.get("host");
  req.file.url = `${protocol}://${host}/${req.file.path}`;
  res.json({ file: req.file });
});

router.post("/delete-file", (req, res) => {
  const { path } = req.body;
  fs.unlink(path, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to delete image" });
    }
    res.json({ message: "File deleted successfully" });
  });
});

router.post("/sendMessage", upload.single("image"), sendMessage);
router.post("/sendTemplate", sendTemplate);
router.use("/users", require("./users"));
router.use("/apps", require("./apps"));
router.use("/groups", require("./groups"));
router.use("/recipients", require("./recipients"));
router.use("/message-templates", require("./message-templates"));
router.get("/stats", require("../controllers/stats.controller").stats);
router.get("/logs", index);
router.delete("/logs", clear);

module.exports = router;
