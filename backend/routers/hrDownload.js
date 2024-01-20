const express = require('express');
const router = express.Router();
const File = require('../models/file');
const APIError = require('../errors');
const path = require('path');
const fs = require('fs');
const { authenticate, isHR } = require('../middlewares/auth');

// api/hrDownload/fileName.pdf
router.get('/:fileName', authenticate, isHR, async (req, res, next) => {
    const fileName = req.params.fileName;
    const fileDoc = await File.findOne({ fileName });

    if (!fileDoc) {
        return next(new APIError("No such file!", 404));
    }

    const filePath = path.join(fileDoc.filePath, fileDoc.fileName);

    // Check if file exists
    if (fs.existsSync(filePath)) {
        return res.sendFile(filePath);
    } else {
        return next(new APIError("File not found!", 404));
    }

});

module.exports = router;
