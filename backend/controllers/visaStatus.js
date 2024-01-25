const APIError = require('../errors')
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../models/user');
const VisaStatus = require('../models/visaStatus');
const File = require('../models/file');
const Application = require('../models/personalInformation');

const getAllVisaStatus = async (req, res, next) => {
    try {
        const visaStatus = await VisaStatus.find();
        const results = [];
        for (const item of visaStatus) {
            const user = await Application.findOne({user: item.user});
            const files = await File.find({ user: item.user });

            const obj = {};
            obj.optReceipt = item.optReceipt;
            obj.optEAD = item.optEAD;
            obj.I983 = item.I983;
            obj.I20 = item.I20;
            obj.user = item.user;
            obj.feedback = item.feedback;
            obj.onboardingInfo = user.onboardingInfo;
            obj.employmentDetails = user.employmentDetails;
            obj.name = `${user.firstName} ${user.middleName} ${user.lastName}`;
            obj.files = files;

            results.push(obj);
        }
        res.status(200).json(results);
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

const approveVisaStatus = async (req, res, next) => {
    let uid = req.params?.uid;

    if (!uid || !ObjectId.isValid(uid)) {
        return next(new APIError("User id not valid!", 400));
    }
    try {
        const user = await User.findById(uid);

        if (!user) {
            return next(new APIError("No user found for this uid!", 400));
        }

        let visaStatus = await VisaStatus.findOne({ user: uid });

        if (!visaStatus) {
            return next(new APIError("No visaStatus found for this UID!", 400));
        }

        if (visaStatus.optReceipt.status === "pending") {
            visaStatus.optReceipt.status = "approved";
        } else if (visaStatus.optEAD.status === "pending") {
            visaStatus.optEAD.status = "approved";
        } else if (visaStatus.I983.status === "pending") {
            visaStatus.I983.status = "approved";
        } else {
            visaStatus.I20.status = "approved";
        }
        visaStatus.feedback = "";
        visaStatus = await visaStatus.save();

        res.status(200).json(visaStatus);
    } catch (error) {
        console.error(error);
        return next(new APIError(error.message, 500));
    }
};
const rejectVisaStatus = async (req, res, next) => {
    let uid = req.params?.uid;

    if (!uid || !ObjectId.isValid(uid)) {
        return next(new APIError("User id not valid!", 400));
    }
    try {
        const user = await User.findById(uid);

        if (!user) {
            return next(new APIError("No user found for this uid!", 400));
        }

        let visaStatus = await VisaStatus.findOne({ user: uid });

        if (!visaStatus) {
            return next(new APIError("No visaStatus found for this UID!", 400));
        }

        if (visaStatus.optReceipt.status === "pending") {
            visaStatus.optReceipt.status = "rejected";
        } else if (visaStatus.optEAD.status === "pending") {
            visaStatus.optEAD.status = "rejected";
        } else if (visaStatus.I983.status === "pending") {
            visaStatus.I983.status = "rejected";
        } else {
            visaStatus.I20.status = "rejected";
        }
        visaStatus.feedback = req.body.feedback;
        visaStatus = await visaStatus.save();

        res.status(200).json(visaStatus);
    } catch (error) {
        console.error(error);
        return next(new APIError(error.message, 500));
    }
};

module.exports = {
    getVisaStatusByUID,
    getAllVisaStatus,
    approveVisaStatus,
    rejectVisaStatus
}