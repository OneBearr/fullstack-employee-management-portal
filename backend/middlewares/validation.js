const User = require('../models/User')

const checkEmpty = (req, res, next) => {
    const user = req.body;
    if (!user.username || !user.email || !user.password) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }
    next();
    return;
}
const checkDuplicate = async (req, res, next) => {
    try {
        const { username, email } = req.body;

        let user = await User.findOne({ username });
        if (user) {
            return res.status(400).send({ message: "Failed! Username is already in use!" });
        }

        user = await User.findOne({ email });
        if (user) {
            return res.status(400).send({ message: "Failed! Email is already in use!" });
        }
        next();
        return;
    } catch (error) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
}
const checkIfEmailExist = async (req, res, next) => {
    try {
        const { email } = req.body;
        user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send("Email not exist, please signup first");
        }
        next();
        return;
    } catch (error) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
}

module.exports = {
    checkEmpty,
    checkDuplicate,
    checkIfEmailExist
}