const { authenticate } = require("../middlewares/auth")
const express = require('express');
const router = express.Router();
const path = require('path');
const uploadPath = path.join(__dirname, "../upload");
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        //console.log(file);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E2)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
})
const upload = multer({ storage });
const File = require('../models/file');
const VisaStatus = require('../models/visaStatus');
const APIError = require('../errors');

// api/upload/opt
router.post('/opt', authenticate, upload.single("opt"), async (req, res, next) => {
    try {
        const uid = req.user.id;
        const optDocType = req.body.optDocType;
        let visaStatus = await VisaStatus.findOne({ user: uid });
        if (!visaStatus) {
            visaStatus = new VisaStatus({ user: uid });
            visaStatus = await visaStatus.save();
        }
        if (req.file) {
            let newFile = new File({
                fileType: optDocType,
                user: req.user.id,
                filePath: "../upload",
                fileName: req.file.filename,
                originalFileName: req.file.originalname,
                access: `http://localhost:3000/api/download/${req.file.filename}`,
                hrAccess: `http://localhost:3000/api/hrDownload/${req.file.filename}`
            });

            if (optDocType) {
                newFile = await newFile.save();

                switch (optDocType) {
                    case 'optReceipt':
                        if (visaStatus.optReceipt.file) {
                            await File.findByIdAndDelete(visaStatus.optReceipt.file);
                        }
                        visaStatus.optReceipt = { status: "pending", file: newFile.id };
                        break;
                    case 'optEAD':
                        if (visaStatus.optEAD.file) {
                            await File.findByIdAndDelete(visaStatus.optEAD.file);
                        }
                        visaStatus.optEAD = { status: "pending", file: newFile.id };
                        break;
                    case 'I983':
                        if (visaStatus.I983.file) {
                            await File.findByIdAndDelete(visaStatus.I983.file);
                        }
                        visaStatus.I983 = { status: "pending", file: newFile.id };
                        break;
                    case 'I20':
                        if (visaStatus.I20.file) {
                            await File.findByIdAndDelete(visaStatus.I20.file);
                        }
                        visaStatus.I20 = { status: "pending", file: newFile.id };
                        break;
                    default:
                }
                visaStatus = await visaStatus.save();
            }
            return res.status(201).json({ message: "upload sucess!" });
        }
        return next(new APIError("upload failed!", 400));
    } catch (error) {
        console.error(error);
        return next(new APIError(error.message, 500));
    }
});

// api/upload/profile
// to be done
router.post('/profile', upload.single("profile"), (req, res) => {
    if (req.file) {
        return res.status(201).json({ message: "upload sucess!" });
    }
    return res.status(400).json({ message: "upload failed!" });
});

// api/upload/doc
// to be done
router.post('/doc', upload.single("doc"), (req, res) => {
    if (req.file) {
        return res.status(201).json({ message: "upload sucess!" });
    }
    return res.status(400).json({ message: "upload failed!" });
});

module.exports = router;
