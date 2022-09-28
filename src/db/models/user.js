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
            User.hasOne(models.VerificationToken);
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
            roleId: {
              type: DataTypes.INTEGER,
              validate:{
                notEmpty: true
              }
            },
            photoProfile: {
              type: DataTypes.STRING,
              validate:{
                notEmpty: true
              }
            },
            phoneNumber: {
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
            gender: {
              type: DataTypes.STRING,
              validate:{
                notEmpty: true,
                min: 6, 
              }
            },
            fcmToken: DataTypes.STRING,
            birthDate: DataTypes.DATE,
            googleId: DataTypes.STRING,
            provider: DataTypes.STRING,
            isVerified: DataTypes.BOOLEAN,
            deletedAt: DataTypes.TIMESTAMP,
        },
        {
            sequelize,
            modelName: 'tbl_users',
        }
    )
    
    return User
}
