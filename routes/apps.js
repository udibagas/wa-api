const { App } = require("../models");
const router = require("express").Router();

router
  .get("/", async (req, res, next) => {
    try {
      const apps = await App.findAll({
        order: [["name", "asc"]],
      });
      res.status(200).json(apps);
    } catch (error) {
      next(error);
    }
  })

  .post("/", async (req, res, next) => {
    try {
      const app = await App.create({ ...req.body, UserId: req.user.id });
      res.status(201).json(app);
    } catch (error) {
      next(error);
    }
  })

  .put("/:id", async (req, res, next) => {
    try {
      const app = await App.findByPk(req.params.id);

      if (!app) {
        const error = new Error("App not found");
        error.status = 404;
        throw error;
      }

      await app.update(req.body);
      res.status(200).json(app);
    } catch (error) {
      next(error);
    }
  })

  .delete("/:id", async (req, res, next) => {
    try {
      const app = await App.findByPk(req.params.id);

      if (!app) {
        const error = new Error("App not found");
        error.status = 404;
        throw error;
      }

      await app.destroy();
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  })

  .post("/:id/token", async (req, res, next) => {
    try {
      const app = await App.findByPk(req.params.id);

      if (!app) {
        const error = new Error("App not found");
        error.status = 404;
        throw error;
      }

      const token = await app.generateToken(req.user);
      res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
