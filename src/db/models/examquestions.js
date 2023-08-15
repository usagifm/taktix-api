'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class ExamQuestions extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            ExamQuestions.belongsTo(models.SetMaster, {
                as: 'question_type',
                foreignKey: 'question_type_id',
                foreignKeyConstraint: true,
            })
        }
    }
    ExamQuestions.init(
        {
            exam_id: {
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

            correct_statement_label:{
                type: DataTypes.STRING,
            },

            incorrect_statement_label:{
                type: DataTypes.STRING,
            }

        },
        {
            sequelize,
            modelName: 'ExamQuestions',
            underscored: true,
            // Custom Name
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    )
    return ExamQuestions
}
