'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'lks_exam_attemptions_answers', // table name
      'image_answer', // new field name
      {
        type: Sequelize.TEXT,
        allowNull: true,
        after: "answer"
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
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
