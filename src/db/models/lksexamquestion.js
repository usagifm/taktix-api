'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LksExamQuestion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LksExamQuestion.belongsTo(models.SetMaster, {
        as: 'question_type',
        foreignKey: 'question_type_id',
    })
    }
  }
  LksExamQuestion.init({
    lks_content_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

    a: {
      type: DataTypes.STRING
    },

    b: {
      type: DataTypes.STRING
    },

    c: {
      type: DataTypes.STRING
    },

    d: {
      type: DataTypes.STRING
    },

    e: {
      type: DataTypes.STRING
    },

    answer: {
      type: DataTypes.STRING,
      allowNull: false,
    },

  }, {
    sequelize,
    modelName: 'LksExamQuestion',
    underscored: true,

    // Custom Name
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return LksExamQuestion;
};