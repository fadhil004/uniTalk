const { Partner } = require('../models');

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

module.exports = { authorizePartner };
