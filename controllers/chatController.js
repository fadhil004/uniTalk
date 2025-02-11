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
    
    static async editChat(req, res) {
        try {
            const { id } = req.params;
            const { pesan } = req.body;

            const chat = await Chat.findByPk(id);
            if (!chat) {
                return res.status(404).json({ message: "Chat not found" });
            }

            chat.pesan = pesan;
            chat.edited = true;
            await chat.save();

            res.status(200).json({ message: "Chat updated successfully", chat });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Failed to update chat", error });
        }
    }

    static async getPartnerChats(req, res) {
        try {
            const { partnerId } = req.decoded; 

            if (!partnerId) {
                return res.status(403).json({ message: 'Access denied' });
            }

            const groupChats = await Chat.findAll({
                where: { partnerId, id_reference: { $ne: null } }, // id_reference tidak boleh null
                attributes: ['id', 'id_sender', 'id_receiver', 'id_reference', 'pesan', 'edited', 'createdAt'],
                order: [['createdAt', 'DESC']]
            });

            const privateChats = await Chat.findAll({
                where: { partnerId, id_reference: null }, // id_reference harus null (bukan group)
                attributes: ['id', 'id_sender', 'id_receiver', 'pesan', 'edited', 'createdAt'],
                order: [['createdAt', 'DESC']]
            });

            return res.status(200).json({
                message: 'Chats retrieved successfully',
                groupChats,
                privateChats
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Failed to fetch chats', error });
        }
    }
}

module.exports = chatController
