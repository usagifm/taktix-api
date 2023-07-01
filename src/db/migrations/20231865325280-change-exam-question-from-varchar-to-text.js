'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('exam_questions', 'question', {
      type: Sequelize.TEXT,
      allowNull: true // note this
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('exam_questions', 'question', {
      type: Sequelize.TEXT,
      allowNull: true // note this
    });
  }
};