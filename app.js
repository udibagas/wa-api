require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(require("./routes"));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;

  if (err.name == "SequelizeValidationError") {
    const errors = {};

    err.errors.forEach((e) => {
      if (errors[e.path] == undefined) {
        errors[e.path] = [];
      }

      errors[e.path].push(e.message);
    });

    res.status(400).json({ message: "Validation Error", errors });
  } else {
    res.status(status).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
