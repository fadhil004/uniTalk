const express = require('express');
const router = express.Router();
const { Chat, Partner} = require('../models');
const { uploadAttachment } = require('../helpers/uploadAttachments');
const chatController = require('../controllers/chatController');

const { authentication } = require('../middlewares/authentication');
const { authorizePartner, authorizeAdmin } = require('../middlewares/authorization');

router.post('/send', uploadAttachment('attachments'), authentication, authorizePartner, chatController.sendMessage); 
//router.get('/', authentication, authorizeAdmin, chatController.getAllMessages); 
//router.delete('/:id', authentication, authorizePartner, chatController.deleteMessage);
router.put('/:id', authentication, authorizePartner, chatController.editChat);
router.get('/chat-statistics', authentication, authorizePartner, chatController.getChatStatistics);

// Middleware untuk validasi API Key
// const validateApiKey = async (req, res, next) => {
//     const api_key = req.query.api_key;
//     // const api_key = req.headers["x-api-key"];
//     if (!api_key) {
//         return res.status(403).json({ message: "API Key is required" });
//     }

//     const partner = await Partner.findOne({ where: { api_key } });
//     if (!partner) {
//         return res.status(403).json({ message: "Invalid API Key" });
//     }

//     req.partnerId = partner.id; // Simpan partnerId di request
//     next();
// };

// // Ambil daftar chat pengguna
// router.get("/", validateApiKey, async (req, res) => {
//     try {
//         const chats = await Chat.findAll({
//             where: { partnerId: req.partnerId },
//             order: [["createdAt", "DESC"]],
//         });

//         res.status(200).json({ message: "Chats retrieved successfully", chats });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Failed to fetch chats", error });
//     }
// });

// // Ambil pesan dalam percakapan tertentu
// router.get("/:id_reference", validateApiKey, async (req, res) => {
//     try {
//         const { id_reference } = req.params;
//         const messages = await Chat.findAll({
//             where: { partnerId: req.partnerId, id_reference },
//             order: [["createdAt", "ASC"]],
//         });

//         res.status(200).json({ message: "Chat messages retrieved successfully", messages });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Failed to fetch chat messages", error });
//     }
// });

// // Hapus pesan chat tertentu
// router.delete("/:id", validateApiKey, async (req, res) => {
//     try {
//         const { id } = req.params;
//         const chat = await Chat.findOne({ where: { id, partnerId: req.partnerId } });

//         if (!chat) {
//             return res.status(404).json({ message: "Chat message not found" });
//         }

//         await chat.destroy();
//         res.status(200).json({ message: "Chat message deleted successfully" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Failed to delete chat message", error });
//     }
// });

router.get('/embed', async (req, res) => {
    const api_key = req.query.api_key;
    console.log("Received API Key:", api_key);
    if (!api_key) return res.status(403).send("API Key is required");

    const partner = await Partner.findOne({ where: { api_key } });
    if (!partner) return res.status(403).send("Invalid API Key");

    res.render('embed', { partner,  layout: 'embed' });
});

module.exports = router