const { Partner } = require('../models');
const { v4: uuidv4 } = require('uuid');

// Registrasi Partner
exports.registerPartner = async (req, res) => {
    try {
        const { nama_partner, logo_partner } = req.body;

        let partner;
        let attempt = 0;

        while (!partner && attempt < 5) { 
            try {
                const api_key = uuidv4();
                partner = await Partner.create({
                    nama_partner,
                    logo_partner,
                    api_key,
                });
            } catch (error) {
                if (error.name === 'SequelizeUniqueConstraintError') {
                    console.log('Duplicate api_key detected. Retrying...');
                    attempt++;
                } else {
                    throw error; 
                }
            }
        }

        if (!partner) {
            return res.status(500).json({
                message: 'Failed to generate unique API key after multiple attempts',
            });
        }


        res.status(201).json({
            message: 'Partner registered successfully',
            partner,
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            console.log('Duplicate api_key detected. Retrying...');
            return createPartner(data); // Coba ulang
        }
        res.status(500).json({ message: 'Error registering partner', error: error.message });
    }
};

// Dapatkan Semua Partner
exports.getAllPartners = async (req, res) => {
    try {
        const partners = await Partner.findAll();
        res.status(200).json(partners);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching partners', error: error.message });
    }
};

// Hapus Partner
exports.deletePartner = async (req, res) => {
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
