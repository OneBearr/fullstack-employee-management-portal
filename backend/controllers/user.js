const User = require('../models/user')
const APIError = require('../errors')

const createUser = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        let user = new User({ username, password, email });

        user = await user.save();
        return res.status(200).json(user);
    } catch (error) {
        console.error(error);
        return next(new APIError("Server Internal Error", 500));
    }
}

module.exports = {
    createUser
}