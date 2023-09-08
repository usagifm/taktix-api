'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class QuestionsBank extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  QuestionsBank.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },

    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    image: {
      type: DataTypes.STRING,
    },

    question_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    exam_category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    a: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    b: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    c: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    d: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    e: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'QuestionsBank',
    underscored: true,
    paranoid: true,
    // Custom Name
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });
  return QuestionsBank;
};