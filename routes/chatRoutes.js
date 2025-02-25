const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Chat, Partner} = require('../models');
const upload = require('../helpers/uploadAttachments');
const chatController = require('../controllers/chatController');

const { authentication } = require('../middlewares/authentication');
const { authorizePartner, authorizeAdmin } = require('../middlewares/authorization');

router.post('/send', chatController.sendMessage);
router.put('/:id', authentication, authorizePartner, chatController.editChat);
router.get('/chat-statistics', authentication, authorizePartner, chatController.getChatStatistics);

router.get('/embed', async (req, res) => {
    const { api_key, id_sender } = req.query;
    console.log("id sender : ", id_sender);
    console.log("api key : ", api_key);

    if (!api_key || !id_sender ) {
        return res.status(403).send("API Key && ID Sender is required");
    } 
    const partner = await Partner.findOne({ where: { api_key } });
    if (!partner) return res.status(403).send("Invalid API Key");

    res.render('embed', { api_key, partner, id_sender, layout: 'embed' });
});

router.get('/get-chats', async (req, res) => {
    try {
        const { api_key, id_sender } = req.query;

        if (!api_key || !id_sender) {
            return res.status(403).json({ message: 'API Key dan ID Pengirim diperlukan' });
        }

        const partner = await Partner.findOne({ where: { api_key } });
        if (!partner) return res.status(403).json({ message: 'API Key tidak valid' });

        // Ambil semua chat terkait pengguna ini
        const chats = await Chat.findAll({
            where: {
                partnerId: partner.id,
                [Op.or]: [
                    { id_sender },
                    { id_receiver: id_sender },
                    { id_reference: id_sender }
                ]
            },
            order: [['createdAt', 'ASC']]
        });
        res.status(200).json({ message: 'Daftar chat berhasil diambil', chats });
    } catch (error) {
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil chat', error: error.message });
    }
});

router.get('/get-chat-history', async (req, res) => {
    try {
        const { api_key, id_sender, id_receiver } = req.query;

        // Validasi parameter yang diperlukan
        if (!api_key || !id_sender || !id_receiver) {
            return res.status(400).json({ message: 'API Key, ID Pengirim, dan ID Penerima diperlukan' });
        }

        // Memeriksa keberadaan partner berdasarkan API Key
        const partner = await Partner.findOne({ where: { api_key } });
        if (!partner) {
            return res.status(403).json({ message: 'API Key tidak valid' });
        }

        // Mengambil pesan antara id_sender dan id_receiver yang terkait dengan partner
        const chats = await Chat.findAll({
            where: {
                partnerId: partner.id,
                [Op.or]: [
                    {
                        id_sender: id_sender,
                        id_receiver: id_receiver
                    },
                    {
                        id_sender: id_receiver,
                        id_receiver: id_sender
                    }
                ]
            },
            order: [['createdAt', 'ASC']] // Mengurutkan pesan dari yang terlama ke terbaru
        });

        res.status(200).json({ message: 'Riwayat obrolan berhasil diambil', chats });
    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil riwayat obrolan', error: error.message });
    }
});


module.exports = router