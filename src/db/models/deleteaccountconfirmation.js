'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
    class DeleteAccountConfirmationToken extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            VerificationToken.belongsTo(models.User, {
                as: 'user',
                foreignKey: 'user_id',
                // foreignKeyConstraint: true,
            })
        }
    }
    DeleteAccountConfirmationToken.init(
        {
            user_id: DataTypes.INTEGER,
            token: DataTypes.STRING,
            is_account_deleted: DataTypes.BOOLEAN,
            valid_through: DataTypes.DATE
        },
        {
            sequelize,
            modelName: 'DeleteAccountConfirmationToken',
            underscored: true,
            paranoid: true,

            // Custom Name
            createdAt: 'created_at',
            updatedAt: 'updated_at',
            deletedAt: 'deleted_at',
         
        }
    )
    return DeleteAccountConfirmationToken
}
