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

// api/upload/opt
router.post('/opt', authenticate, upload.single("opt"), async (req, res) => {
    if (req.file) {
        //console.log(req.file);
        let newFile = new File({
            fileType: 'visa_document',
            user: req.user.id,
            filePath: req.file.destination,
            fileName: req.file.filename,
            access: `http://localhost:3000/api/download/${req.file.filename}`,
            hrAccess: `http://localhost:3000/api/hrDownload/${req.file.filename}`
        });
        newFile = await newFile.save();
        return res.status(201).json({ message: "upload sucess!" });
    }
    return res.status(400).json({ message: "upload failed!" });
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
