'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LksExamAttemptions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      LksExamAttemptions.hasMany(models.LksExamAttemptionsAnswers, {
        as: 'answers',
        foreignKey: 'lks_attemption_id',
    })

    LksExamAttemptions.hasMany(models.LksExamAttemptionsAnswers, {
      as: 'not_yet_corrected',
      foreignKey: 'lks_attemption_id',
  })

    LksExamAttemptions.belongsTo(models.LksContent,{
        as: 'lks_content',
        foreignKey: 'lks_content_exam_id'
    })

    LksExamAttemptions.belongsTo(models.User,{
      as: 'student',
      foreignKey: 'user_id'
  })
    }
  }
  LksExamAttemptions.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    lks_content_exam_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },


    class_id: {
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
    modelName: 'LksExamAttemptions',
    underscored: true,
    // Custom Name
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return LksExamAttemptions;
};