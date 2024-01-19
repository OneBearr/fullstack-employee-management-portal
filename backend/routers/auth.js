const APIError = require("../errors");
const express = require("express");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const router = express.Router();
const path = require("path");
const envPath = path.join(__dirname, "../.env");
const User = require("../models/user");
const RegistrationToken = require("../models/registrationToken");
const { authenticate, isHR } = require("../middlewares/auth");
const { createUser } = require("../controllers/user");
const { checkEmpty, checkDuplicate } = require("../middlewares/validation");
const { requestRegister, verifyRegistrationToken, signin } = require("../controllers/auth");
require("dotenv").config({ path: envPath });

// /auth/signin
router.post("/signin", signin);
// /auth/request-register
router.post("/request-register", authenticate, isHR, requestRegister);
// /auth/register
router.post("/register/:token", checkEmpty, checkDuplicate, verifyRegistrationToken, createUser);

module.exports = router;
