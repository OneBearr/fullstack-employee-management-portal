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
const { checkEmpty } = require("../middlewares/validation");
const { requestRegister, verifyRegistrationToken, } = require("../controllers/auth");
require("dotenv").config({ path: envPath });

// /auth/signin
router.post("/signin", async (req, res, next) => {
    try {
        const { username, password } = req.body;

        let user = await User.findOne({ username });

        if (!user) {
            throw new APIError(
                "This username does not exist, please signup first",
                400
            );
        }

        if (user.password !== password) {
            throw new APIError("Username and password do not match!", 401);
        }

        const payload = {
            user: {
                id: user._id,
            },
        };

        const expiration = new Date();
        //expiration.setHours(expiration.getHours() + 1); // Set expiration to 1 hour
        expiration.setDate(expiration.getDate() + 30);
        const token = await jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "30d",
        });

        console.log(`User:${user} login`);
        res.json({
            token,
            isHR: user.isHR,
            username: user.username,
            userID: user.id,
            email: user.email,
            exp: expiration,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// /auth/request-register
router.post("/request-register", authenticate, isHR, requestRegister);
// /auth/register
router.post("/register/:token", checkEmpty, verifyRegistrationToken, createUser);

module.exports = router;
