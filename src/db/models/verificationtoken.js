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
                foreignKey: 'user_id',
                foreignKeyConstraint: true,
            })
        }
    }
    VerificationToken.init(
        {
            user_id: DataTypes.INTEGER,
            token: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'VerificationToken',
            underscored: true,
        }
    )
    return VerificationToken
}
