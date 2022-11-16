'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('questions_banks', 'a', {
      type: Sequelize.STRING,
      allowNull: true // note this
    });
    await queryInterface.changeColumn('questions_banks', 'b', {
      type: Sequelize.STRING,
      allowNull: true // note this
    });
    await queryInterface.changeColumn('questions_banks', 'c', {
      type: Sequelize.STRING,
      allowNull: true // note this
    });
    await queryInterface.changeColumn('questions_banks', 'd', {
      type: Sequelize.STRING,
      allowNull: true // note this
    });
    await queryInterface.changeColumn('questions_banks', 'e', {
      type: Sequelize.STRING,
      allowNull: true // note this
    });
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
