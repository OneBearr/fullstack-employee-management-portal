const mongoose = require("mongoose");

const visaStatusSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    //status: String,
    //documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }]
    optReceipt: {
        status: {
            type: String,
            default: 'no submit'// e.g., 'no submit', 'pending', 'approved', 'rejected'
        },
        file: { type: mongoose.Schema.Types.ObjectId, ref: 'File' }
    },
    optEAD: {
        status: {
            type: String,
            default: 'no submit'// e.g., 'no submit', 'pending', 'approved', 'rejected'
        },
        file: { type: mongoose.Schema.Types.ObjectId, ref: 'File' }
    },
    I983: {
        status: {
            type: String,
            default: 'no submit'// e.g., 'no submit', 'pending', 'approved', 'rejected'
        },
        file: { type: mongoose.Schema.Types.ObjectId, ref: 'File' }
    },
    I20: {
        status: {
            type: String,
            default: 'no submit'// e.g., 'no submit', 'pending', 'approved', 'rejected'
        },
        file: { type: mongoose.Schema.Types.ObjectId, ref: 'File' }
    }
});

const VisaStatus = mongoose.model("VisaStatus", visaStatusSchema);
module.exports = VisaStatus;