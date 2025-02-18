const { Partner, User } = require('../models');

class partnerController{
    static async registerPartner(req, res){
        try {
            const { nama_partner } = req.body;
            const { id: userId } = req.decoded;

            let user = await User.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            let logo_partner = req.file ? req.file.filename : null;

            let partner = await Partner.create({
                nama_partner,
                logo_partner,
                status: 'pending'
            });

            partner.api_key = partner.id;
            await partner.save();

            user.partnerId = partner.id;
            await user.save();

            req.session.message = { type: 'success', text: `Regist as a partner success!` };

            return res.redirect('/');

            // res.status(201).json({
            //     message: 'Partner registered successfully',
            //     partner,
            //     user
            // });
        } catch (error) {
            res.status(500).json({ message: 'Error registering partner', error: error.message });
        }
    };

    static async getAllPartners(req, res){
        try {
            const partners = await Partner.findAll();
            res.status(200).json(partners);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching partners', error: error.message });
        }
    };

    static async deletePartner(req, res){
        try {
            const { id } = req.params;
            const result = await Partner.destroy({ where: { id } });

            if (result === 0) {
                return res.status(404).json({ message: 'Partner not found' });
            }

            res.status(200).json({ message: 'Partner deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting partner', error: error.message });
        }
    };

}

module.exports = partnerController