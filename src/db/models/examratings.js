'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ExamRatings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ExamRatings.init({
    exam_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    rate: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },

    feedback: {
      type: DataTypes.STRING,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

  }, {
    sequelize,
    modelName: 'ExamRatings',
    underscored: true,
    paranoid: true,
    // Custom Name
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });
  return ExamRatings;
};