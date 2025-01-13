'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Chat.belongsTo(models.Partner, { foreignKey: 'partnerId'});
    }
  }
  Chat.init({
    partnerId:{
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Partners',
        key: 'id',
      }
    },
    id_sender:{
      type: DataTypes.STRING,
      allowNull: false
    },
    id_receiver:{
      type: DataTypes.STRING,
      allowNull: false 
    }, 
    pesan: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    attachment:{
      type: DataTypes.STRING,
      allowNull: false
    } 
  }, {
    sequelize,
    modelName: 'Chat',
  });
  return Chat;
};