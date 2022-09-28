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
            photoProfile: {
                type: Sequelize.TEXT,
            },
            phoneNumber: {
                type: Sequelize.STRING,
                unique: true,
            },
            password: {
                type: Sequelize.STRING,
            },
            googleId: {
                type: Sequelize.STRING,
            },
            fcmToken: {
                type: Sequelize.STRING,
            },
            provider: {
                type: Sequelize.STRING,
            },
            roleId: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            isVerified: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            birthDate: {
                type: Sequelize.DATE,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            deletedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
        })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Users')
    },
}
