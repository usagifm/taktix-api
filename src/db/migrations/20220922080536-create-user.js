'use strict'
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            username: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            gender: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            photo_profile: {
                type: Sequelize.TEXT,
            },
            phone_number: {
                type: Sequelize.STRING,
                unique: true,
            },
            password: {
                type: Sequelize.STRING,
            },
            google_id: {
                type: Sequelize.STRING,
            },
            fcm_token: {
                type: Sequelize.STRING,
            },
            provider: {
                type: Sequelize.STRING,
            },
            role_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            is_verified: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            birth_date: {
                type: Sequelize.DATE,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            deleted_at: {
                allowNull: true,
                type: Sequelize.DATE,
            },
        })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Users')
    },
}
