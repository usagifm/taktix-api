'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'questions_banks', // table name
      'exam_category_id', // new field name
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        after: "question_type_id"
      },
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
      'exam_category_id'
    );

    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
