const File = require('../models/file')
const APIError = require('../errors')
const ObjectId = require('mongoose').Types.ObjectId;
const User = require('../models/user');

const getAllFiles = async (req, res, next) => {
    try {
        const files = await File.find();
        return res.status(200).json(files);
    } catch (error) {
        console.error(error);
        return next(new APIError(error.message, 500));
    }
};

const getAllFilesByUID = async (req, res, next) => {
    let uid = req.params?.uid;

    if (!uid || !ObjectId.isValid(uid)) {
        return next(new APIError("User id not valid!", 400));
    }

    const user = await User.findById(uid);

    if (!user) {
        return next(new APIError("No user found for this uid!", 400));
    }

    try {
        const files = await File.find({ user: uid });
        return res.status(200).json(files);
    } catch (err) {
        console.error(err.message);
        return next(new APIError(err.message, 500));
    }
}

module.exports = {
    getAllFiles,
    getAllFilesByUID
}