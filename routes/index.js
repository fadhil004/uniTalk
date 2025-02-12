const express = require('express');
const router = express.Router();

const partnerController = require('../controllers/partnerController');
const userController  = require('../controllers/userController');
const chatController = require('../controllers/chatController');
const dashboardController = require('../controllers/dashboardController');
const { authentication } = require('../middlewares/authentication');
const { authorizeAdmin, authorizePartner } = require('../middlewares/authorization');

//partnerController
router.post('/partners/register', authentication, partnerController.registerPartner); 
router.get('/partners', authentication, authorizeAdmin, partnerController.getAllPartners); 
router.delete('/partners/:id', authentication, authorizeAdmin, partnerController.deletePartner);

//chatController
router.get('/chats', authentication, authorizePartner, chatController.getPartnerChats)

//userController
router.post('/register', userController.registerUser);
router.post('/login', userController.login);
router.get('/users', authentication, authorizeAdmin, userController.getAllUsers);
router.get('/users/:id', authentication, authorizeAdmin, userController.getUserById);

//dashboardController
router.get('/', dashboardController.index)

module.exports = router