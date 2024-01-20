const express = require('express');
const {
    getAllFiles,
} = require('../controllers/file');

const router = express.Router();

// api/files
router.get('/', getAllFiles);

module.exports = router;
