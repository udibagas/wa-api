const nodemailer = require("nodemailer");
const { SMTP_USER, SMTP_PASSWORD } = process.env;

const mailer = nodemailer.createTransport({
  service: "gmail",
  pool: true,
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
});

mailer.verify((error) => {
  if (error) return console.error(error.message);
  console.log("Server is ready to take our messages");
});

module.exports = mailer;
