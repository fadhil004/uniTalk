'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Chats', {
      id: {
        allowNull: false,
        autoIncrement: fale,
        primaryKey: true,
        type: Sequelize.UUID
      },
      partnerId:{
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Partners',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      id_sender: {
        type: Sequelize.STRING
      },
      id_receiver: {
        type: Sequelize.STRING
      },
      id_reference: {
        type: Sequelize.STRING
      },
      pesan: {
        type: Sequelize.TEXT
      },
      attachment: {
        type: Sequelize.STRING
      },
      edited: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Chats');
  }
};