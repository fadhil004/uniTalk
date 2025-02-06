const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chatController');

const { authentication } = require('../middlewares/authentication');
const { authorizePartner } = require('../middlewares/authorization');

router.post('/send', authentication, authorizePartner, chatController.sendMessage); 
router.get('/', authentication, authorizePartner, chatController.getAllMessages); 
router.delete('/:id', authentication, authorizePartner, chatController.deleteMessage);

module.exports = router