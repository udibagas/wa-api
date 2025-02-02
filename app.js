require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorHandlerMiddleware = require("./middlewares/errorHandler.middleware");
const port = process.env.PORT || 3000;

// Middleware
const origin = process.env.CLIENT_URL?.split(",") ?? [];
app.use(cors({ origin, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

app.use(require("./routes"));

// Error handling
app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
