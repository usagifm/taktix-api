'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LksExamAttemptionsAnswers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  LksExamAttemptionsAnswers.init({
    attemption_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    is_corrected: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    is_correct: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'LksExamAttemptionsAnswers',
    underscored: true,
    // Custom Name
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return LksExamAttemptionsAnswers;
};