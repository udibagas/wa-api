const {
  index,
  create,
  lastestMessage,
} = require("../controllers/chats.controller");
const router = require("express").Router();

router.get("/", index).get("/lastestMessage", lastestMessage).post("/", create);

module.exports = router;
