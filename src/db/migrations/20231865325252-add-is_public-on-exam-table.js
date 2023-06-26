'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.addColumn(
      'exams', // table name
      'is_public', // new field name
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        after: "is_free",
        defaultValue: false
      },
      { defaultValue: false }
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
      'exams',
      'is_public',
    );

    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
