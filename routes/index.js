const router = require("express").Router();
const { schema } = require("../graphql/schema");
const { resolver: rootValue } = require("../graphql/resolver");
const { createHandler } = require("graphql-http/lib/use/express");
const { auth } = require("../middlewares/auth.middleware");
const fs = require("fs");
const path = require("path");

router.all("/graphql", auth, createHandler({ schema, rootValue }));
router.get("/gql", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== path.basename(__filename) &&
      file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    router.use(`/api/${file.split(".")[0]}`, require(`./${file}`));
  });

module.exports = router;
