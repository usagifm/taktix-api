'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    const Op = Sequelize.Op

    queryInterface.bulkInsert('set_masters', [
      {
          id: 6004,
          category: 'question_type',
          name: 'Pilihan Ganda Kompleks',
          created_at: new Date(),
          updated_at: new Date(),
      },
      {
          id: 6005,
          category: 'question_type',
          name: 'Pernyataan Ganda',
          created_at: new Date(),
          updated_at: new Date(),
      }])
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {

    queryInterface.bulkDelete('set_masters', {
      [Op.or]: [
          { id: 6004 },
          { id: 6005 }
      ],
  })

    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
