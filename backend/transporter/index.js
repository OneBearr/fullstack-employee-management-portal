const nodemailer = require("nodemailer");
const path = require("path");
const envPath = path.join(__dirname, "../.env");

require('dotenv').config({ path: envPath });

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

module.exports = transporter;