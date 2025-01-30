'use strict';
const { hashPassword } = require('../helpers/bcrypt');
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            this.belongsTo(models.Partner, { foreignKey: 'partnerId', as: 'partner' });
        }
        // async isValidPassword(password) {
        //     return await bcrypt.compare(password, this.password);
        // }
    }

    User.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: DataTypes.ENUM('admin', 'partner'),
                allowNull: true,
                defaultValue: 'partner'
            },
            partnerId:{
              type: DataTypes.UUID,
              allowNull: true,
              references: {
                model: 'Partners',
                key: 'id',
              }
            },
        },
        {
            sequelize,
            modelName: 'User',
            hooks: {
                beforeCreate: async (user) => {
                    user.password = hashPassword(user.password);
                },
            },
        }
    );

    return User;
};
