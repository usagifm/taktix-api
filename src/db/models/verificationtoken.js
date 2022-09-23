'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class VerificationToken extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            VerificationToken.belongsTo(models.User, {
                as: 'user',
                foreignKey: 'userId',
                foreignKeyConstraint: true,
            })
        }
    }
    VerificationToken.init(
        {
            userId: DataTypes.INTEGER,
            token: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'VerificationToken',
        }
    )
    return VerificationToken
}
