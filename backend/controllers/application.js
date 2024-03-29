const APIError = require('../errors');
const PersonalInformation = require('../models/personalInformation');
const User = require('../models/user');
const VisaStatus = require('../models/visaStatus');

const ObjectId = require('mongoose').Types.ObjectId;
const getAllApplication = async (req, res, next) => {
    try {
        const applications = await PersonalInformation.find();
        return res.status(200).json(applications);
    } catch (err) {
        console.error(err.message);
        return next(new APIError(err.message, 500));
    }
};

const searchApplication = async (req, res, next) => {
    let searchName = req.params?.name;

    try {
        const applications = await PersonalInformation.find();
        return res.status(200).json(applications.filter((item)=>{
            const name = `${item.preferredName || ""} ${item.firstName} ${item.middleName || ""} ${item.lastName}`;
            return (name.toLowerCase().includes(searchName.toLowerCase()) && item.onboardingInfo.status==="approved")
        }));
    } catch (err) {
        console.error(err.message);
        return next(new APIError(err.message, 500));
    }
};

// find application(personalInformation) by uid
const getOneApplication = async (req, res, next) => {
    let uid = req.params?.uid;


    if (!uid || !ObjectId.isValid(uid)) {
        return next(new APIError("User id not valid!", 400));
    }

    const user = await User.findById(uid);

    if (!user) {
        return next(new APIError("No user found for this uid!", 400));
    }

    try {
        const application = await PersonalInformation.findOne({ user: uid });
        return res.status(200).json(application);
    } catch (err) {
        console.error(err.message);
        return next(new APIError(err.message, 500));
    }
};

const createApplication = async (req, res, next) => {
    let uid = req.params?.uid;


    if (!uid || !ObjectId.isValid(uid)) {
        return next(new APIError("User id not valid!", 400));
    }

    const user = await User.findById(uid);

    if (!user) {
        return next(new APIError("No user found for this uid!", 400));
    }


    let application = await PersonalInformation.findOne({ user: uid });

    if (application) {
        return next(new APIError("An application for this user was created. Please do not submit a new application", 400));
    }

    try {
        application = new PersonalInformation({ ...req.body, email: user.registerEmail, user: uid, onboardingInfo: { status: 'pending', feedback: "" } });
        application = await application.save();

        user.personalInformation = application._id;
        await user.save();
        console.log("An application is created!");

        res.status(201).json({ message: "An application for this user is created!" });
    } catch (err) {
        console.error(err.message);
        return next(new APIError(err.message, 500));
    }
};

const approveApplication = async (req, res, next) => {
    let uid = req.params?.uid;

    if (!uid || !ObjectId.isValid(uid)) {
        return next(new APIError("User id not valid!", 400));
    }
    try {
        const user = await User.findById(uid);

        if (!user) {
            return next(new APIError("No user found for this uid!", 400));
        }

        let application = await PersonalInformation.findOne({ user: uid });

        if (!application) {
            return next(new APIError("No application found for this UID!", 400));
        }
        let visaStatus = await VisaStatus.findOne({ user: uid });
        if (visaStatus) {
            visaStatus.optReceipt.status = "approved";
            visaStatus.feedback = "";
            visaStatus = await visaStatus.save();
        }
        application.onboardingInfo.feedback = '';
        application.onboardingInfo.status = "approved";

        application = await application.save();
        res.status(200).json(application);
    } catch (error) {
        console.error(error);
        return next(new APIError(error.message, 500));
    }
};
const rejectApplication = async (req, res, next) => {
    let uid = req.params?.uid;

    if (!uid || !ObjectId.isValid(uid)) {
        return next(new APIError("User id not valid!", 400));
    }

    try {
        const user = await User.findById(uid);

        if (!user) {
            return next(new APIError("No user found for this uid!", 400));
        }

        let application = await PersonalInformation.findOne({ user: uid });

        if (!application) {
            return next(new APIError("No application found for this UID!", 400));
        }
        /*
        let visaStatus = await VisaStatus.findOne({ user: uid });
        if (visaStatus) {
            visaStatus.optReceipt.status = "rejected";
            visaStatus.feedback = req.body.feedback;
            visaStatus = await visaStatus.save();
        }*/
        application.onboardingInfo.feedback = req.body.feedback;
        application.onboardingInfo.status = "rejected";

        application = await application.save();
        res.status(200).json(application);
    } catch (error) {
        console.error(error);
        return next(new APIError(error.message, 500));
    }
}
const updateApplication = async (req, res, next) => {
    let uid = req.params?.uid;


    if (!uid || !ObjectId.isValid(uid)) {
        return next(new APIError("User id not valid!", 400));
    }

    const user = await User.findById(uid);

    if (!user) {
        return next(new APIError("No user found for this uid!", 400));
    }

    try {
        let application = await PersonalInformation.findOne({ user: uid });

        if (!application) {
            return next(new APIError("No application found for this UID!", 400));
        }
        let newStatus = "pending";
        if (application.onboardingInfo.status === "rejected") {
            newStatus = "pending";
        } else if (application.onboardingInfo.status === "approved") {
            newStatus = "approved";
        }
        application = await PersonalInformation.findOneAndUpdate({ user: uid }, {
            ...req.body, user: uid, onboardingInfo: {
                status: newStatus,
                feedback: ""
            }
        }, { new: true });
        res.status(200).json(application);
    } catch (err) {
        console.error(err.message);
        return next(new APIError(err.message, 500));
    }
};

module.exports = {
    getAllApplication,
    getOneApplication,
    createApplication,
    updateApplication,
    rejectApplication,
    approveApplication,
    searchApplication
}