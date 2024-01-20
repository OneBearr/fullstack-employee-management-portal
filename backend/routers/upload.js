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


// api/upload/opt
router.post('/opt', upload.single("opt"), (req, res) => {
    if (req.file) {
        console.log(req.file);
        return res.status(201).json({ message: "upload sucess!" });
    }
    return res.status(400).json({ message: "upload failed!" });
});

// api/upload/profile
router.post('/profile', upload.single("profile"), (req, res) => {
    if (req.file) {
        return res.status(201).json({ message: "upload sucess!" });
    }
    return res.status(400).json({ message: "upload failed!" });
});

// api/upload/doc
router.post('/doc', upload.single("doc"), (req, res) => {
    if (req.file) {
        return res.status(201).json({ message: "upload sucess!" });
    }
    return res.status(400).json({ message: "upload failed!" });
});

module.exports = router;
