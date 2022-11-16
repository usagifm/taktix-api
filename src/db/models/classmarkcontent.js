'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClassMarkContent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ClassMarkContent.init({
    member_id: DataTypes.INTEGER,
    class_id: DataTypes.INTEGER,
    lks_content_id: DataTypes.INTEGER
    
  }, {
    sequelize,
    modelName: 'ClassMarkContent',
    underscored: true,
    paranoid: true,
    // Custom Name
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });
  return ClassMarkContent;
};