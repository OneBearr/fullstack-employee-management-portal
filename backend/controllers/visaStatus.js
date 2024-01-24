const APIError = require('../errors')
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../models/user');
const VisaStatus = require('../models/visaStatus');

const getAllVisaStatus = async (req, res, next) => {
    try {
        const visaStatus = await VisaStatus.find();
        res.status(200).json(visaStatus);
        return;
    } catch (error) {
        console.error(error.message);
        return next(new APIError(error.message, 500));
    }
}
const getVisaStatusByUID = async (req, res, next) => {
    let uid = req.params?.uid;
    if (!uid || !ObjectId.isValid(uid)) {
        return next(new APIError("User id not valid!", 400));
    }
    try {
        const user = await User.findById(uid);

        if (!user) {
            return next(new APIError("No user found for this uid!", 400));
        }

        const visaStatus = await VisaStatus.findOne({ user: uid });
        return res.status(200).json(visaStatus);
    } catch (err) {
        console.error(err.message);
        return next(new APIError(err.message, 500));
    }
}

module.exports = {
    getVisaStatusByUID,
    getAllVisaStatus
}