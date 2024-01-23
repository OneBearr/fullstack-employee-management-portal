const express = require('express');
const {
    getAllFiles,
    getAllFilesByUID
} = require('../controllers/file');
const {
    authenticate,
    isOwner
} = require('../middlewares/auth')

const router = express.Router();

// api/files
router.get('/', getAllFiles);

// api/files/:uid
router.get("/:uid", authenticate, isOwner, getAllFilesByUID);
module.exports = router;
