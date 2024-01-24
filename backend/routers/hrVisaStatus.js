const express = require('express');
const {
    getVisaStatusByUID,
    getAllVisaStatus
} = require('../controllers/visaStatus');
const { authenticate, isHR } = require('../middlewares/auth')
const router = express.Router();

// api/hrVisaStatus
router.get('/', authenticate, isHR, getAllVisaStatus);
router.get('/:uid', authenticate, isHR, getVisaStatusByUID);


module.exports = router;
