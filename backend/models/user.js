const mongoose = require("mongoose");

/* const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return value.includes('@');
            }
        }
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    belongings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    },
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    }
});
 */
const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isHR: {
        type: Boolean,
        default: false,
    },
    personalInformation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "PersonalInformation",
    },
    visaStatus: { type: mongoose.Schema.Types.ObjectId, ref: "VisaStatus" },
});
const User = mongoose.model("User", userSchema);

module.exports = User;
