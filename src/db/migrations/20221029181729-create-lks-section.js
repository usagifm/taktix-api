'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lks_sections', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      lks_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      section_title: {
        type: Sequelize.STRING,
        allowNull: false
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
    await queryInterface.dropTable('lks_sections');
  }
};