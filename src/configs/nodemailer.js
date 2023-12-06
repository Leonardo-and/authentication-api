const nodemailer = require("nodemailer");
require("dotenv").config();
const { USER, PASS } = process.env;

const transport = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: "587",
  secure: false,
  auth: {
    user: USER,
    pass: PASS,
  },
});

module.exports = transport;
