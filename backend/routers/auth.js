const APIError = require('../errors');
const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const router = express.Router();
const path = require("path");
const envPath = path.join(__dirname, "../.env");
const User = require('../models/user');
const RegistrationToken = require('../models/registrationToken');
require('dotenv').config({ path: envPath });
// configure the reset password invitation email
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

function generateToken(email) {
    return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

async function storeToken(email, token) {
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1); // Set expiration to 1 hour

    const registrationToken = new RegistrationToken({
        token,
        email,
        expiration,
        used: false
    });

    return await registrationToken.save();
}

// /auth/login
// /auth/request-reset-password
router.post("/request-register", async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            return next(new APIError("Email exists in database!", 400));
        }

        const token = generateToken(email);
        const registerUrl = `http://localhost:3000/auth/register/${token}`;
        await storeToken(email, token);
        // send the reset password invitation email
        await transporter.sendMail({
            to: email,
            subject: 'Register Account',
            text: `Hi, Please click on the following link to register your account: ${registerUrl}`
        });

        return res.send(
            "We have sent a registeration link to your email " + email + ", please check that!"
        );
    } catch (error) {
        console.error(error);
        return next(new APIError("Error sending registeration email", 500));
    }
});

router.post("/register/:token", async (req, res, next) => {
    try {
        const token = req.params.token;
        if (!token) {
            return next(new APIError("No token provided!", 400));
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            console.error(error);
            return next(new APIError("Invalid or expired token!", 401));
        }

        const regToken = await RegistrationToken.findOne({ token, email: decoded.email });
        console.log("1: " + Boolean(regToken));
        console.log("2: " + regToken.used);
        console.log("3: " + (regToken.expiration < new Date()));
        if (!regToken || regToken.used || regToken.expiration < new Date()) {

            return next(new APIError("Invalid or expired token.", 401));
        }

        regToken.used = true;
        await regToken.save();

        const { username, password } = req.body;
        let user = new User({ username, password, email: decoded.email });

        user = await user.save();
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return next(new APIError("Server Internal Error", 500));
    }
});

module.exports = router;
