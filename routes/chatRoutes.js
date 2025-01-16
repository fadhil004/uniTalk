const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chatController');

router.post('/send', chatController.sendMessage); 
router.get('/', chatController.getAllMessages); 
router.delete('/:id', chatController.deleteMessage);

module.exports = router