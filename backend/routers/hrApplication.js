const express = require('express');
const {
    getAllApplication,
    getOneApplication,
    rejectApplication,
    approveApplication,
    searchApplication
} = require('../controllers/application');
const { authenticate, isHR } = require('../middlewares/auth')

const router = express.Router();

// api/hrApplications
router.get('/', authenticate, isHR, getAllApplication);
// api/hrApplications/:uid
router.get('/:uid', authenticate, isHR, getOneApplication);
router.put('/reject/:uid', authenticate, isHR, rejectApplication);
router.put('/approve/:uid', authenticate, isHR, approveApplication);

router.get('/search/:name', authenticate, isHR, searchApplication);

module.exports = router;
