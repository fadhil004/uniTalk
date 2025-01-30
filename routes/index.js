const express = require('express');
const router = express.Router();

const partnerController = require('../controllers/partnerController');
const userController  = require('../controllers/userController');

// router.post('/users/register', registerUser);

//partnerController
router.post('/partners/register', partnerController.registerPartner); 
router.get('/partners', partnerController.getAllPartners); 
router.delete('/partners/:id', partnerController.deletePartner);

//userController
router.post('/register', userController.registerUser);
router.post('/login', userController.login);
router.get('/users', userController.getAllUsers);

module.exports = router