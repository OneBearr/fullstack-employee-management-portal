const transporter = require('../transporter');
const APIError = require('../errors');
const User = require('../models/user');
const ObjectId = require('mongoose').Types.ObjectId;

const sendNotificationByUID = async (req, res, next) => {
    let uid = req.params?.uid;
    if (!uid || !ObjectId.isValid(uid)) {
        return next(new APIError("User id not valid!", 400));
    }
    try {
        const user = await User.findById(uid);
        if (!user) {
            return next(new APIError("No user found for this uid!", 400));
        }
        const msg = await transporter.sendMail({ to: user.email, subject: req.body?.subject, text: req.body?.text });
        res.status(200).json({ message: msg });
    } catch (error) {
        console.error(error);
        next(new APIError(error.message, 500));
    }
}

module.exports = { sendNotificationByUID };