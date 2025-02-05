const {
  index,
  create,
  update,
  destroy,
  generateToken,
} = require("../controllers/apps.controller");

const router = require("express").Router();

router
  .get("/", index)
  .post("/", create)
  .put("/:id", update)
  .delete("/:id", destroy)
  .post("/:id/token", generateToken);

module.exports = router;
