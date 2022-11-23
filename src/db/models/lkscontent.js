'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LksContent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      LksContent.belongsTo(models.SetMaster, {
        as: 'lks_content_type',
        foreignKey: 'lks_content_type_id'
    })

    LksContent.hasMany(models.LksExamQuestion,{
      as: "questions",
      foreignKey: 'lks_content_id',
    })

    LksContent.hasOne(models.ClassMarkContent,{
      as: "mark",
      foreignKey: 'lks_content_id',
    })

    }
  }
  LksContent.init({
    lks_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    lks_section_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    lks_content_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    content_name: {
      type: DataTypes.STRING
    },

    text_content: {
      type: DataTypes.TEXT,
    },

    video_link:{
      type: DataTypes.STRING,
    },

    file_attachment:{
      type: DataTypes.STRING,
    },

    exam_duration: {
      type: DataTypes.INTEGER,
    },


    exam_question_total: {
      type: DataTypes.INTEGER,
      defaultValue:0,
    },

  }, {
    sequelize,
    modelName: 'LksContent',
    underscored: true,
    // Custom Name
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return LksContent;
};