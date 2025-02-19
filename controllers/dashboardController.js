const { Op, Sequelize } = require('sequelize') 
const { Chat, Partner, sequelize } = require('../models');

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
            limit: 4
        });

        const formattedAttachments = recentAttachments.map(chat => ({
            url: `/database/attachments/${chat.attachment}`
        }));

        res.render('dashboardPartner', {
            message,
            user: req.user,
            totalChats,
            totalAttachments,
            recentAttachments: formattedAttachments,
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

            const totalChats = await Chat.count({
                where: { pesan: { [Op.ne]: null}}
            });
            const totalAttachments = await Chat.count({
                where: { attachment: { [Op.ne]: null}}
            });
            const totalPartners = await Partner.count();

            const partners = await Partner.findAll({
                attributes: ["id", "nama_partner", "status", "createdAt", "logo_partner"], // Pastikan kolom sesuai dengan database
                order: [["createdAt", "DESC"]],
                limit: 5
            });

            res.render('dashboardAdmin', { 
                message,
                user: req.user, 
                totalChats,
                totalAttachments,
                totalPartners,
                partners,
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
    static async approval(req, res){
        try{
            res.render('approval', {
                user: req.user,
                cache: false
            })
        } catch (err) {
            console.error('Error rendering approval:', err);
            res.status(500).send(err.message);
        }
    }
    static async dashboardAdminData(req, res) {
        try {
            const year = req.query.year || new Date().getFullYear();
            console.log(`📆 Tahun yang dipilih: ${year}`)   

            const totalPartnersByMonth = await sequelize.query(`
                SELECT EXTRACT(MONTH FROM "createdAt") AS month, COUNT(*) AS total
                FROM "Partners"
                WHERE EXTRACT(YEAR FROM "createdAt") = :year
                GROUP BY month
                ORDER BY month;
            `, { 
                replacements: { year: Number(year) }, 
                type: sequelize.QueryTypes.SELECT 
            });

    
            // Konversi data agar memiliki nilai untuk semua bulan (1-12)
            let monthlyData = new Array(12).fill(0);
            totalPartnersByMonth.forEach((item) => {
                if (item.month && item.total) { // Pastikan ada bulan dan totalnya
                    monthlyData[item.month - 1] = Number(item.total); 
                }
            });
    
            // Ambil jumlah partner berdasarkan status
            const partnerStatus = await Partner.findAll({
                attributes: ["status", [Sequelize.fn("COUNT", "*"), "count"]],
                group: ["status"],
                raw: true
            });
    

            console.log("📊 Total Partners by Month:", totalPartnersByMonth);
            console.log("📊 Total Partners by Month:", monthlyData);

            // Konversi hasil ke format yang diinginkan
            const statusData = {
                accepted: 0,
                rejected: 0,
                pending: 0
            };
    
            partnerStatus.forEach((item) => {
                statusData[item.status.toLowerCase()] = item.count;
            });
    
            res.json({ totalPartnersByMonth: monthlyData, partnerStatus: statusData });
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

module.exports = dashboardController;
