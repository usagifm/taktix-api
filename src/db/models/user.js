'use strict'
const { Model } = require('sequelize')

const phoneValidationRegex = /\d{3}-\d{3}-\d{4}/ 
module.exports = (sequelize, DataTypes) => {

  
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            User.hasOne(models.VerificationToken,{
              as: 'verification_token',
              foreignKey: 'user_id',
              foreignKeyConstraint: true,
          });

          User.belongsToMany(models.Exam, {
            as: 'user_exams',
            through: models.ExamEnrollments,
            foreignKey: {
             name: 'user_id'
           }
          });

          User.belongsToMany(models.Lks, {
            as:"tutor_lks" ,
            through: models.TutorLks,
            foreignKey: 'tutor_id'
          });

          User.belongsToMany(models.Class, {
            as:"user_classes" ,
            through: models.ClassMember,
            foreignKey: 'user_id'
          });

          User.belongsTo(models.SetMaster, {
            as: 'role',
            foreignKey: 'role_id',
            foreignKeyConstraint: true,
        })

        User.belongsTo(models.Province, {
          as: 'province',
          foreignKey: 'province_id',
          foreignKeyConstraint: true,
      })


      User.belongsTo(models.SetMaster, {
        as: 'gender_type',
        foreignKey: 'gender',
    })

        }

        
    }

    User.prototype.toJSON =  function () {
      var values = Object.assign({}, this.get());
    
      // hide these attribute when returning json on res
      delete values.password;
      delete values.provider;
      return values;
    }

    User.init(
        {
            name:{
              type: DataTypes.STRING,
              validate:{
                notEmpty: true
              }
            },
            username:{
              type: DataTypes.STRING,
              validate:{
                notEmpty: true
              },unique: {
                args: true,
                msg: 'Username sudah digunakan'
            }
            },  
            email:  {
              type: DataTypes.STRING,
              validate:{
                notEmpty: true,
                isEmail: true
              },unique: {
                args: true,
                msg: 'Email sudah digunakan'
            }
            },
            photo_profile: {
              type: DataTypes.STRING,
              // validate:{
              //   notEmpty: true
              // }
            },
            role_id: {
              type: DataTypes.INTEGER,
              validate:{
                notEmpty: true
              }
            },
            gender: {
              type: DataTypes.INTEGER,
              validate:{
                notEmpty: true
              }
            },
            phone_number: {
              type: DataTypes.STRING,
              validate:{
                notEmpty: true,
              },unique: {
                args: true,
                msg: 'Nomor HP sudah digunakan'
            }
            },
            password: {
              type: DataTypes.STRING,
              validate:{
                notEmpty: true,
                min: 6, 
              }
            },
            birth_date: DataTypes.DATE,
            google_id: DataTypes.STRING,
            fcm_token: DataTypes.STRING,
            provider: DataTypes.STRING,
            is_verified: DataTypes.BOOLEAN,
        },
        {
            sequelize,
            modelName: 'User',
            underscored: true,
            paranoid: true,

 
            // Custom Name
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
         
        }
    )
    
    return User
}