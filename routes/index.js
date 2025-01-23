const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("It's working!");
});

router.use("/api", require("./api"));

module.exports = router;
