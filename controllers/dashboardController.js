const { Op } = require('sequelize') 
const { Chat } = require('../models');

class dashboardController {
    static async dashboardPartner(req, res) {
        try {
            let message = req.session.message;
            req.session.message = null; 

        const totalChats = await Chat.count({
            where: { partnerId: req.user.partnerId }
        });

        const totalAttachments = await Chat.count({
            where: {
                partnerId: req.user.partnerId,
                attachment: { [Op.ne]: null } 
            }
        });

        const recentAttachments = await Chat.findAll({
            where: {
                partnerId: req.user.partnerId,
                attachment: { [Op.ne]: null }
            },
            order: [['createdAt', 'DESC']],
            limit: 6
        });

        res.render('dashboardPartner', {
            message,
            user: req.user,
            totalChats,
            totalAttachments,
            recentAttachments,
            cache: false
        });
        } catch (err) {
            console.error('Error rendering dashboard:', err);
            res.status(500).send(err.message);
        }
    }
    static async partner(req, res) {
        try {
            let message = req.session.message;
            req.session.message = null; 

            res.render('partner', { 
                message,
                user: req.user, 
                cache: false 
            });
        } catch (err) {
            console.error('Error rendering partner:', err);
            res.status(500).send(err.message);
        }
    }
    static async chat(req, res) {
        try {
            res.render('chat', { 
                user: req.user, 
                cache: false 
            });
        } catch (err) {
            console.error('Error rendering chat:', err);
            res.status(500).send(err.message);
        }
    }
    static async helpCenter(req, res) {
        try {
            res.render('helpCenter', { 
                user: req.user, 
                cache: false 
            });
        } catch (err) {
            console.error('Error rendering help center:', err);
            res.status(500).send(err.message);
        }
    }
    static async dashboardAdmin(req, res) {
        try {
            let message = req.session.message;
            req.session.message = null; 
            res.render('dashboardAdmin', { 
                message,
                user: req.user, 
                cache: false 
            });
        } catch (err) {
            console.error('Error rendering dashboard admin:', err);
            res.status(500).send(err.message);
        }
    }
    static async partnersData(req, res) {
        try {
            res.render('partnersData', { 
                user: req.user, 
                cache: false 
            });
        } catch (err) {
            console.error('Error rendering partners data:', err);
            res.status(500).send(err.message);
        }
    }
}

module.exports = dashboardController;
