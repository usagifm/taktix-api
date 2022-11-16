'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      grade_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      subject_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      banner: {
        type: Sequelize.STRING
      },
      creator_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      video_preview: {
        type: Sequelize.STRING
      },
      content_total: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
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
    await queryInterface.dropTable('lks');
  }
};