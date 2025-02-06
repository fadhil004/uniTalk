const { Partner, User } = require('../models');

const authorizePartner = async (req, res, next) => {
    try {
        if (req.decoded.role !== 'partner') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const partner = await Partner.findByPk(req.decoded.partnerId);
        if (!partner) {
            return res.status(404).json({ message: 'Partner not found' });
        }

        req.partner = partner;
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Authorization failed', error });
    }
};

const authorizeAdmin = async (req, res, next) => {
    try {
        if (req.decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        const admin = await User.findByPk(req.decoded.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        req.admin = admin;
        next();
    } catch (error) {
        return res.status(500).json({ message: 'Authorization failed', error });
    }
};

module.exports = { authorizePartner, authorizeAdmin };
