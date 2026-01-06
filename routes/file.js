const router = require("express").Router();
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const moment = require("moment");
const { auth } = require("../middlewares/auth.middleware");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
  .post("/", upload.single("file"), async (req, res) => {
    try {
      let resourceType = "auto";
      if (req.file.type.startsWith("image/")) {
        resourceType = "image";
      } else if (req.file.type === "application/pdf") {
        resourceType = "raw"; // PDFs should be uploaded as 'raw'
      }

      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "wa-api",
        resource_type: resourceType,
      });

      // Delete local file after successful upload
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Error deleting local file:", err);
      });

      res.json({
        file: {
          ...req.file,
          cloudinaryUrl: result.secure_url,
          cloudinaryPublicId: result.public_id,
          url: result.secure_url,
        },
      });
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      // Fallback to local file URL if Cloudinary fails
      const protocol = req.protocol;
      const host = req.get("host");
      req.file.url = `${protocol}://${host}/${req.file.path}`;
      res.json({ file: req.file });
    }
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
