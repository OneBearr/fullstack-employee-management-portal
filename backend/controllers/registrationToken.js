const RegistrationToken = require('../models/registrationToken');
const Application = require('../models/personalInformation');
const APIError = require('../errors');


const getHistory = async (req, res, next) => {
    try {
        const result = [];
        const regs = await RegistrationToken.find();

        for (const reg of regs) {
            const obj = {};
            const application = await Application.findOne({ email: reg.email });
            obj.email = reg.email;
            obj.submitted = !application ? false : true;
            obj.name = !application ? "" : `${application.firstName} ${application.lastName}`;
            obj.link = `http://localhost:5173/register/${reg.token}`
            obj.expiration = reg.expiration;
            obj.isUsed = reg.used;
            result.push(obj);
        }
        return res.status(200).json(result);

    } catch (error) {
        console.log(error);
        return next(new APIError(error.message, 500));
    }
}

module.exports = {
    getHistory
};