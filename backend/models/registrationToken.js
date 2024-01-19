const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const registrationTokenSchema = new Schema({
    token: String,
    email: String,
    expiration: Date,
    used: { type: Boolean, default: false }
});

const RegistrationToken = mongoose.model('RegistrationToken', registrationTokenSchema);

module.exports = RegistrationToken;