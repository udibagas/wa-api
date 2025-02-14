const {
  index,
  create,
  update,
  destroy,
} = require("../controllers/user.controller");

const router = require("express").Router();

router
  .get("/", index)
  .post("/", create)
  .put("/:id", update)
  .delete("/:id", destroy);

module.exports = router;
