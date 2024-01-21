const APIError = require('../errors');
const jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");
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

const signin = async (req, res, next) => {
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
            registerEmail: user.registerEmail,
            exp: expiration,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
};

const requestRegister = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            return next(new APIError("Email exists in database!", 400));
        }

        const token = generateToken(email);
        const registerUrl = `http://localhost:5173/register/${token}`;
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
};


const verifyRegistrationToken = async (req, res, next) => {
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
            return next(new APIError("Invalid or expired token! Please ask HR for a new invitation to register.", 401));
        }

        const regToken = await RegistrationToken.findOne({ token, email: decoded.email });
        console.log("1: " + Boolean(regToken));
        console.log("2: " + regToken.used);
        console.log("3: " + (regToken.expiration < new Date()));
        if (!regToken || regToken.used || regToken.expiration < new Date()) {

            return next(new APIError("Invalid or expired token! Please ask HR for a new invitation to register.", 401));
        }

        regToken.used = true;
        await regToken.save();

        req.body.registerEmail = decoded.email;

        return next();
    } catch (error) {
        console.error(error);
        return next(new APIError("Server Internal Error", 500));
    }
}

module.exports = {
    requestRegister,
    verifyRegistrationToken,
    signin
}