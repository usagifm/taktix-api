'use strict'

module.exports = {
    async up(queryInterface, Sequelize) {
        const Op = Sequelize.Op


        queryInterface.bulkInsert('set_masters', [

                  {
                      id: 6003,
                      category: 'question_type',
                      name: 'Isian Singkat',
                      created_at: new Date(),
                      updated_at: new Date(),
                  },

                  {
                      id: 7001,
                      category: 'lks_subject',
                      name: 'Bahasa Indonesia',
                      created_at: new Date(),
                      updated_at: new Date(),
                  },
                  {
                    id: 7002,
                    category: 'lks_subject',
                    name: 'Matematika',
                    created_at: new Date(),
                    updated_at: new Date(),
                },
                {
                  id: 7003,
                  category: 'lks_subject',
                  name: 'Fisika',
                  created_at: new Date(),
                  updated_at: new Date(),
              },
              {
                id: 7004,
                category: 'lks_subject',
                name: 'Kimia',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
              id: 7005,
              category: 'lks_subject',
              name: 'Biologi',
              created_at: new Date(),
              updated_at: new Date(),
          },
          {
            id: 7006,
            category: 'lks_subject',
            name: 'Ekonomi',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
          id: 7007,
          category: 'lks_subject',
          name: 'Sejarah',
          created_at: new Date(),
          updated_at: new Date(),
      },
      {
        id: 7008,
        category: 'lks_subject',
        name: 'Geografi',
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 7009,
        category: 'lks_subject',
        name: 'Bahasa Inggris',
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

    async down(queryInterface, Sequelize) {
        /**
         * Add reverting commands here.
         *
         * Example:
         * await queryInterface.dropTable('users');
         */
    },
}
