'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'questions_banks', // table name
      'correct_statement_label', // new field name
      {
        type: Sequelize.STRING,
        allowNull: true,
        after: "answer",
      }
    )
    queryInterface.addColumn(
      'questions_banks', // table name
      'incorrect_statement_label', // new field name
      {
        type: Sequelize.STRING,
        allowNull: true,
        after: "answer",
      }
    )
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {

    return queryInterface.removeColumn(
      'questions_banks',
      'correct_statement_label',
    ),queryInterface.removeColumn(
      'questions_banks',
      'incorrect_statement_label',
    );


    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
