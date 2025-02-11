'use strict';

const { hashPassword } = require('../helpers/bcrypt');

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.bulkInsert('Users', [
            {
                name: 'Admin',
                email: 'admin@example.com',
                password: hashPassword('admin123'),
                role: 'admin',
                partnerId: null,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete('Users', { email: 'admin@example.com' }, {});
    }
};
