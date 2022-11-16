'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class Class extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here

            Class.belongsTo(models.SetMaster, {
                as: 'grade',
                foreignKey: 'grade_id',
            })

            Class.belongsTo(models.SetMaster, {
                as: 'subject',
                foreignKey: 'subject_id',
            })

            Class.belongsTo(models.Lks, {
                as: 'lks',
                foreignKey: 'lks_id',
            })

            Class.belongsToMany(models.User, {
                as:"class_members" ,
                unique: false,
                foreignKey: 'class_id',
                through: models.ClassMember,
              });
        }
    }
    Class.init(
        {
            class_name: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: true,
                },
            },

            lks_id: {
                type: DataTypes.INTEGER,
                // validate: {
                //     notEmpty: true,
                // },
            },

            subject_id: {
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

            limit: {
                type: DataTypes.INTEGER,
                validate: {
                    notEmpty: true,
                },
            },

            creator_id: {
                type: DataTypes.INTEGER,
                validate: {
                    notEmpty: true,
                },
            },

            enroll_code: {
                type: DataTypes.STRING,
                validate: {
                    notEmpty: true,
                },
                unique: {
                    args: true,
                    msg: 'Kode kelas sudah digunakan',
                },
            },

            member_total: {
                type: DataTypes.INTEGER,
                validate: {
                    notEmpty: true,
                },
                defaultValue: 0,
            },
        },
        {
            sequelize,
            modelName: 'Class',
            underscored: true,
            paranoid: true,
            // Custom Name
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
        }
    )
    return Class
}
