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
                type: DataTypes.STRING,
                allowNull: false,
            },
            lks_id: {
                type: DataTypes.INTEGER,
            },
            subject_id: {
                type: DataTypes.INTEGER,
            },
            grade_id: {
                type: DataTypes.INTEGER,
            },
            limit: {
                type: DataTypes.INTEGER,
            },
            creator_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            enroll_code: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            member_total: {
                type: DataTypes.INTEGER,
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
