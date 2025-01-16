const { Chat } = require('../models');

class chatController{
    static async sendMessage(req, res) {
        try {
            const { partnerId, id_sender, id_receiver, id_reference, pesan, attachment } = req.body;
    
            const chat = await Chat.create({
                partnerId,
                id_sender,
                id_receiver,
                id_reference,
                pesan,
                attachment,
            });
    
            res.status(201).json({
                message: 'Message sent successfully',
                chat,
            });
        } catch (error) {
            res.status(500).json({ message: 'Error sending message', error: error.message });
        }
    };
    
    static async getAllMessages(req, res) {
        try {
            const chats = await Chat.findAll();
            res.status(200).json(chats);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching messages', error: error.message });
        }
    };
    
    static async deleteMessage(req, res) {
        try {
            const { id } = req.params;
    
            const result = await Chat.destroy({ where: { id } });
    
            if (result === 0) {
                return res.status(404).json({ message: 'Message not found' });
            }
    
            res.status(200).json({ message: 'Message deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting message', error: error.message });
        }
    };    
}

module.exports = chatController
