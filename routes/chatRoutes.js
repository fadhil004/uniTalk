const express = require('express');
const router = express.Router();
const { uploadAttachment } = require('../helpers/uploadAttachments');
const chatController = require('../controllers/chatController');

const { authentication } = require('../middlewares/authentication');
const { authorizePartner, authorizeAdmin } = require('../middlewares/authorization');

router.post('/send', uploadAttachment('attachments'), authentication, authorizePartner, chatController.sendMessage); 
router.get('/', authentication, authorizeAdmin, chatController.getAllMessages); 
router.delete('/:id', authentication, authorizePartner, chatController.deleteMessage);
router.put('/:id', authentication, authorizePartner, chatController.editChat);
router.get('/chat-statistics', authentication, authorizePartner, chatController.getChatStatistics);


module.exports = router