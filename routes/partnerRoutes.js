const express = require('express');
const router = express.Router();
const {
    registerPartner,
    getAllPartners,
    deletePartner,
} = require('../controllers/partnerController');

router.post('/register', registerPartner); 
router.get('/', getAllPartners); 
router.delete('/:id', deletePartner);

module.exports = router;
