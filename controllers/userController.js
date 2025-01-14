const { User, Partner } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Register User (Partner)
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, partnerId } = req.body;

        // Validasi role
        if (role !== 'partner' && role !== 'admin') {
            return res.status(400).json({ message: 'Invalid role' });
        }

        // Validasi partnerId untuk partner
        if (role === 'partner') {
            const partner = await Partner.findByPk(partnerId);
            if (!partner) {
                return res.status(404).json({ message: 'Partner not found' });
            }
        }

        // Buat user baru
        const user = await User.create({
            name,
            email,
            password,
            role,
            partnerId: role === 'partner' ? partnerId : null,
        });

        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to register user', error });
    }
};

module.exports = { registerUser };
