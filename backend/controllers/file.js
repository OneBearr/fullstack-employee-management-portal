const File = require('../models/file')
const APIError = require('../errors')

const getAllFiles = async (req, res, next) => {
    try {
        const files = await File.find();
        return res.status(200).json(files);
    } catch (error) {
        console.error(error);
        return next(new APIError(error.message, 500));
    }
};


module.exports = {
    getAllFiles
}