const mongoose = require("mongoose");

const personalInformationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    middleName: { type: String },
    preferredName: { type: String },
    profilePicture: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
    address: {
        streetName: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        state: {
            type: String,
            required: true,
        },
        zip: {
            type: String,
            required: true,
        },
    },
    cellPhoneNumber: { type: String, required: true },
    workPhoneNumber: { type: String },
    email: { type: String, required: true },
    ssn: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: { type: String, required: true },
    emergencyContacts: {
        type: [{
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            middleName: String,
            phone: String,
            email: String,
            relationship: { type: String, required: true }
        }],
        validate: {
            validator: function (v) {
                return Array.isArray(v) && v.length > 0;
            },
            message: 'You must add at least one emergency contact'
        }
    },
    reference: {
        firstName: String,
        lastName: String,
        phone: String,
        email: String,
        relationship: String,
        //default: null
    },
    workAuth: {
        isCitizen: { type: Boolean, required: true },
        citizenType: String,
        workAuthType: String
    },
    employmentDetails: {
        visaTitle: String,
        startDate: Date,
        endDate: Date,
        //default: null
    },
    onboardingInfo: {
        status: { type: String, default: "pending" /* e.g., 'pending', 'approved', 'rejected' */ },
        feedback: String
    }
});

const PersonalInformation = mongoose.model("PersonalInformation", personalInformationSchema);
module.exports = PersonalInformation;

