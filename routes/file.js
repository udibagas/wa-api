const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const moment = require("moment");
const { auth } = require("../middlewares/auth.middleware");

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

router
  .use(auth)
  .post("/", upload.single("file"), (req, res) => {
    const protocol = req.protocol;
    const host = req.get("host");
    req.file.url = `${protocol}://${host}/${req.file.path}`;
    res.json({ file: req.file });
  })

  .post("/delete", (req, res) => {
    const { path } = req.body;
    fs.unlink(path, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to delete image" });
      }
      res.json({ message: "File deleted successfully" });
    });
  });

module.exports = router;
