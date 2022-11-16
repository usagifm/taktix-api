'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LksSection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LksSection.hasMany(models.LksContent,{
        as: "contents",
        foreignKey: 'lks_section_id',
    })

    }
  }
  LksSection.init({
    lks_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    section_title: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'LksSection',
    underscored: true,
    paranoid: true,
    // Custom Name
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });
  return LksSection;
};