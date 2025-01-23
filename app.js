require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(require("./routes"));

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
