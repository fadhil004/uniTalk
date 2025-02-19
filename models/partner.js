'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Partner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Partner.hasMany(models.Chat, { foreignKey: 'partnerId' });
      Partner.hasOne(models.User, {foreignKey: 'partnerId', as: 'user'})
    }
  }
  Partner.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    nama_partner:{
      type: DataTypes.STRING,
      allowNull: false
    },
    logo_partner:{
      type: DataTypes.STRING,
      allowNull: true
    },
    api_key:{
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Partner'
  });
  return Partner;
};