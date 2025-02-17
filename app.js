require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandlerMiddleware = require("./middlewares/errorHandler.middleware");
const { Contact, ScheduledMessage } = require("./models");
const { Op } = require("sequelize");
const port = process.env.PORT || 3000;

// Middleware
const origin = process.env.CLIENT_URL?.split(",") ?? [];
app.use(cors({ origin, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use(require("./routes"));
app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

ScheduledMessage.findAll().then((data) => {
  data.forEach((i) => {
    i.createJob();
  });
});

// bikin cron job buat ulang tahun
Contact.findAll({ where: { dateOfBirth: { [Op.not]: null } } }).then((data) => {
  data.forEach((i) => {
    i.createJob();
  });
});
