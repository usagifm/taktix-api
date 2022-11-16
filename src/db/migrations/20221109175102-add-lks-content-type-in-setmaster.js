'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.bulkInsert('set_masters', [

      {
          id: 8001,
          category: 'lks_content_type',
          name: 'Materi',
          created_at: new Date(),
          updated_at: new Date(),
      },

      {
          id: 8002,
          category: 'lks_content_type',
          name: 'Soal',
          created_at: new Date(),
          updated_at: new Date(),
      },

  ])
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
