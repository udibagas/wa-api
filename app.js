require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const errorHandlerMiddleware = require("./middlewares/errorHandler.middleware");
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(require("./routes"));

// Error handling
app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
