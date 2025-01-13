const express = require('express');
const router = express.Router();
const {
    sendMessage,
    getAllMessages,
    deleteMessage,
} = require('../controllers/chatController');

router.post('/send', sendMessage); 
router.get('/', getAllMessages); 
router.delete('/:id', deleteMessage);

module.exports = router;
