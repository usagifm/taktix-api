'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class Exam extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Exam.belongsTo(models.SetMaster, {
                as: 'grade',
                foreignKey: 'grade_id',
                foreignKeyConstraint: true,
            })

            Exam.belongsTo(models.SetMaster, {
                as: 'category',
                foreignKey: 'category_id',
                foreignKeyConstraint: true,
            })

            Exam.belongsTo(models.SetMaster, {
                as: 'exam_category',
                foreignKey: 'exam_category_id',
                foreignKeyConstraint: true,
            })
        }
    }
    Exam.init(
        {
            title: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: true,
                },
            },

            category_id: {
                type: DataTypes.INTEGER,
                validate: {
                    notEmpty: true,
                },
            },

            exam_category_id: {
                type: DataTypes.INTEGER,
                validate: {
                    notEmpty: true,
                },
            },

            grade_id: {
                type: DataTypes.INTEGER,
                validate: {
                    notEmpty: true,
                },
            },

            duration: {
                type: DataTypes.INTEGER,
                validate: {
                    notEmpty: true,
                },
            },

            total_question: {
                type: DataTypes.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },

            price: {
                type: DataTypes.INTEGER,
            },

            is_free: {
                type: DataTypes.BOOLEAN,
                validate: {
                    notEmpty: true,
                },
            },

            rating: {
                type: DataTypes.FLOAT,
                defaultValue: 0,
            },

            rating: {
                type: DataTypes.FLOAT,
                defaultValue: 0,
            },

            banner_image: {
                type: DataTypes.INTEGER,
            },

            creator_id: {
                type: DataTypes.INTEGER,
                validate: {
                    notEmpty: true,
                },
            },
        },
        {
            sequelize,
            modelName: 'Exam',
            underscored: true,
            paranoid: true,
            // Custom Name
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
        }
    )
    return Exam
}
