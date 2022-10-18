'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExamAttemptions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ExamAttemptions.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    exam_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    started_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    finished_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    total_correct: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:0,
    },

    total_incorrect: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:0,
    },

    total_empty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue:0,
    },

    score: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'ExamAttemptions',
    underscored: true,
    // Custom Name
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return ExamAttemptions;
};