'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('questions_banks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      question: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
  
      image: {
        type: Sequelize.STRING,
      },
  
      question_type: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
  
      a: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      b: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      c: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      d: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      e: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      answer: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },

      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
    },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('QuestionBank');
  }
};