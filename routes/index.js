const router = require("express").Router();
const { schema } = require("../graphql/schema");
const { resolver: rootValue } = require("../graphql/resolver");
const { createHandler } = require("graphql-http/lib/use/express");
const { auth } = require("../middlewares/auth.middleware");

router.all("/graphql", auth, createHandler({ schema, rootValue }));
router.get("/gql", (_req, res) => {
  res.type("html");
  res.end(ruruHTML({ endpoint: "/graphql" }));
});

router.use("/api", require("./api"));

module.exports = router;
