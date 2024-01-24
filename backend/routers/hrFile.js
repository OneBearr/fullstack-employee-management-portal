const express = require('express');
const {
    getAllFiles,
    getAllFilesByUID
} = require('../controllers/file');
const {
    authenticate,
    isHR
} = require('../middlewares/auth')

const router = express.Router();

// api/hrFiles
router.get('/', authenticate, isHR, getAllFiles);

// api/hrFiles/:uid
router.get("/:uid", authenticate, isHR, getAllFilesByUID);
module.exports = router;
