'use strict'
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('classes', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            class_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            lks_id: {
                type: Sequelize.INTEGER,
            },
            subject_id: {
                type: Sequelize.INTEGER,
            },
            grade_id: {
                type: Sequelize.INTEGER,
            },
            limit: {
                type: Sequelize.INTEGER,
            },
            creator_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
            },
            enroll_code: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            member_total: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
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
        await queryInterface.dropTable('classes')
    },
}
