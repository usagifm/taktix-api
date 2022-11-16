'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

      Lks.belongsTo(models.SetMaster, {
        as: 'grade',
        foreignKey: 'grade_id',
        foreignKeyConstraint: true,
    })

    Lks.hasMany(models.TutorLks,{
      as: "is_owned",
      foreignKey: 'lk_id',
      foreignKeyConstraint: true,
  })



  Lks.belongsTo(models.SetMaster, {
        as: 'subject',
        foreignKey: 'subject_id',
        foreignKeyConstraint: true,
    })
      // define association here


      Lks.hasMany(models.LksSection,{
        as: "sections",
        foreignKey: 'lks_id',
    })


    }
  }
  Lks.init({
    grade_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    subject_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    banner: DataTypes.STRING,
    creator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    video_preview: DataTypes.STRING,
    content_total: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
  }, {
    freezeTableName: true,
    sequelize,
    modelName: 'Lks',
    tableName: 'lks',
    underscored: true,
    paranoid: true,
    // Custom Name
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  });
  return Lks;
};