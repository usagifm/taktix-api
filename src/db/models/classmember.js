'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ClassMember extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ClassMember.init({
    class_id: DataTypes.INTEGER,
    joined_at: DataTypes.DATE,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ClassMember',
    underscored: true,
    // Custom Name
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return ClassMember;
};