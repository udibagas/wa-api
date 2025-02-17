const { Group } = require("../models");
const router = require("express").Router();

router
  .get("/", async (req, res, next) => {
    try {
      const groups = await Group.findAll({
        order: [["id", "asc"]],
      });
      res.status(200).json(groups);
    } catch (error) {
      next(error);
    }
  })

  .post("/", async (req, res, next) => {
    try {
      const group = await Group.create(req.body);
      res.status(201).json(group);
    } catch (error) {
      next(error);
    }
  })

  .put("/:id", async (req, res, next) => {
    try {
      const group = await Group.findByPk(req.params.id);

      if (!group) {
        const error = new Error("Group not found");
        error.status = 404;
        throw error;
      }

      await group.update(req.body);
      res.status(200).json(group);
    } catch (error) {
      next(error);
    }
  })

  .delete("/:id", async (req, res, next) => {
    try {
      const group = await Group.findByPk(req.params.id);

      if (!group) {
        const error = new Error("Group not found");
        error.status = 404;
        throw error;
      }

      await group.destroy();
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
