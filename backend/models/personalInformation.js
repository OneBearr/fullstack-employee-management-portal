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
    emergencyContacts: [{
        firstName: String,
        lastName: String,
        phone: String,
        email: String,
        relationship: String
    }],
    reference: {
        firstName: String,
        lastName: String,
        phone: String,
        email: String,
        relationship: String
    },
    employmentDetails: {
        visaTitle: String,
        startDate: Date,
        endDate: Date
    }
});