const express = require('express');
const router = express.Router();

const partnerController = require('../controllers/partnerController');
// const { registerUser } = require('../controllers/UserController');

// router.post('/users/register', registerUser);

//partnerController
router.post('/partners/register', partnerController.registerPartner); 
router.get('/partners', partnerController.getAllPartners); 
router.delete('/partners/:id', partnerController.deletePartner);

module.exports = router