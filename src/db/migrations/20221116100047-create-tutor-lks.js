'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tutor_lks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      lk_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      tutor_id: {
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tutor_lks');
  }
};