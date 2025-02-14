const {
  index,
  create,
  update,
  destroy,
  submit,
} = require("../controllers/templates.controller");
const router = require("express").Router();

router
  .get("/", index)
  .post("/", create)
  .put("/:id", update)
  .patch("/:id/submit", submit)
  .delete("/:id", destroy);

module.exports = router;
