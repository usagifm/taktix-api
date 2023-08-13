'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {

    queryInterface.bulkInsert('set_masters', [
      {
          id: 4004,
          category: 'category',
          name: 'SNBT',
          created_at: new Date(),
          updated_at: new Date(),
      },
      {
          id: 3008,
          category: 'exam_category',
          name: 'Penalaran Induktif',
          created_at: new Date(),
          updated_at: new Date(),
      },
      {
        id: 3009,
        category: 'exam_category',
        name: 'Penalaran Deduktif',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3010,
        category: 'exam_category',
        name: 'Penalaran Kuantitatif',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3011,
        category: 'exam_category',
        name: 'Pengetahuan dan Pemahaman Umum',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3012,
        category: 'exam_category',
        name: 'Kemampuan Memahami Bacaan dan Menulis',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3013,
        category: 'exam_category',
        name: 'Pengetahuan Kuantitatif',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3014,
        category: 'exam_category',
        name: 'Literasi dalam Bahasa Indonesia',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3015,
        category: 'exam_category',
        name: 'Literasi dalam Bahasa Inggris',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3016,
        category: 'exam_category',
        name: 'Penalaran Matematika',
        created_at: new Date(),
        updated_at: new Date(),
      },
    
    ])
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
          { id: 4004 },
          { id: 3008 },
          { id: 3009 },
          { id: 3010 },
          { id: 3011 },
          { id: 3012 },
          { id: 3013 },
          { id: 3014 },
          { id: 3015 },
          { id: 3016 },
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
