'use strict'
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('exams', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            title: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            category_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            exam_category_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            grade_id: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            duration: {
                allowNull: false,
                type: Sequelize.INTEGER,
            },
            total_question: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue:0,
            },
            price: {
                type: Sequelize.INTEGER,
            },
            is_free: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
            },
            rating: {
                type: Sequelize.FLOAT,
                defaultValue:0,
            },
            banner_image: {
                type: Sequelize.INTEGER,
            },
            creator_id: {
                type: Sequelize.INTEGER,
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
            deleted_at: {
                allowNull: true,
                type: Sequelize.DATE,
            },
        })
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('exams')
    },
}
