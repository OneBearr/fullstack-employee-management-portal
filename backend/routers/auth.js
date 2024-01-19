
const express = require('express');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
const router = express.Router();
const path = require("path");
const envPath = path.join(__dirname, "../.env");
const User = require('../models/user');
require('dotenv').config({ path: envPath });

// /auth/login
// /auth/request-reset-password
router.post("/register/:id", async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).send("User not found");
        }

        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpire = Date.now() + 3600000; // expire in one hour

        // save the token and expire time for this user
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpire;
        await user.save();

        // configure the reset password invitation email
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });
        const resetUrl = `http://localhost:5173/reset-password/${resetToken}`;
        // send the reset password invitation email
        await transporter.sendMail({
            to: email,
            subject: 'Password Reset',
            text: `Hi ${user.username}, Please click on the following link to reset your password: ${resetUrl}`
        });

        res.send(
            "We have sent the update password link to your email " + email + ", please check that!"
        );
    } catch (error) {
        console.error(error);
        res.status(500).send("Error sending password reset email");
    }
});

// /auth/reset-password


// /auth/signup
router.post('/signup', checkEmpty, checkDuplicate, createUser);

module.exports = router;
