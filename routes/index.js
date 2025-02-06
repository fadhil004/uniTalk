const express = require('express');
const router = express.Router();

const partnerController = require('../controllers/partnerController');
const userController  = require('../controllers/userController');
const { authentication } = require('../middlewares/authentication');
const { authorizeAdmin } = require('../middlewares/authorization');

//partnerController
router.post('/partners/register', authentication, partnerController.registerPartner); 
router.get('/partners', authentication, authorizeAdmin, partnerController.getAllPartners); 
router.delete('/partners/:id', authentication, authorizeAdmin, partnerController.deletePartner);

//userController
router.post('/register', userController.registerUser);
router.post('/login', userController.login);
router.get('/users', authentication, authorizeAdmin, userController.getAllUsers);

module.exports = router