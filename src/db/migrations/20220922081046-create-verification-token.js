module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface
            .createTable('VerificationTokens', {
                id: {
                    allowNull: false,
                    autoIncrement: true,
                    primaryKey: true,
                    type: Sequelize.INTEGER,
                },
                user_id: {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    onUpdate: 'cascade',
                    onDelete: 'cascade',
                    references: { model: 'Users', key: 'id' },
                },
                token: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                created_at: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
                updated_at: {
                    allowNull: false,
                    type: Sequelize.DATE,
                },
            })
            .then(() => {
                console.log('created VerificationToken table')
                return queryInterface.sequelize.query(`
        CREATE EVENT expireToken
        ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL  1 DAY 
        DO
        DELETE FROM VerificationTokens WHERE createdAt < DATE_SUB(NOW(), INTERVAL 1 DAY);
        `)
            })
            .then(() => {
                console.log('expireToken event created')
            })
    },
    down: function (queryInterface) {
        return queryInterface
            .dropTable('VerificationTokens')
            .then(() => {
                console.log('VerificationTokens table dropped')
                return queryInterface.sequelize.query(
                    `DROP EVENT IF EXISTS expireToken`
                )
            })
            .then(() => {
                console.log('expireToken event dropped')
            })
    },
}
