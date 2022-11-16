'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('class_mark_contents', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      member_id: {
        type: Sequelize.INTEGER
      },
      class_id: {
        type: Sequelize.INTEGER
      },
      lks_content_id: {
        type: Sequelize.INTEGER
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('class_mark_contents');
  }
};