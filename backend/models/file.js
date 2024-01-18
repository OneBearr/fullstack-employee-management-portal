const mongoose = require('mongoose')
const fileSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fileType: String, // e.g., 'profile_picture', 'visa_document', 'onboarding_document'
    fileName: String,
    filePath: String,
    uploadDate: { type: Date, default: Date.now }
});

const FileModel = mongoose.model("File", fileSchema);
module.exports = FileModel;