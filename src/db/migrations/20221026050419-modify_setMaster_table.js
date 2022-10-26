'use strict'

module.exports = {
    async up(queryInterface, Sequelize) {
        const Op = Sequelize.Op

        queryInterface.bulkDelete('set_masters', {
            [Op.or]: [
                { id: 3001 },
                { id: 3002 },
                { id: 3003 },
                { id: 4001 },
                { id: 4002 },
                { id: 4003 },
                { id: 4004 },
                { id: 6001 },
                { id: 6002 },
                { id: 6003 },
            ],
        })
        queryInterface.bulkInsert('set_masters', [
            {
                id: 3001,
                category: 'exam_category',
                name: 'Matematika',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 3002,
                category: 'exam_category',
                name: 'Bahasa Indonesia',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 3003,
                category: 'exam_category',
                name: 'Biologi',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 3004,
                category: 'exam_category',
                name: 'Fisika',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 3005,
                category: 'exam_category',
                name: 'Kimia',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 3006,
                category: 'exam_category',
                name: 'Soshum',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 3007,
                category: 'exam_category',
                name: 'Saintek',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 4001,
                category: 'category',
                name: 'UTBK',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 4002,
                category: 'category',
                name: 'CPNS',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 4003,
                category: 'category',
                name: 'Kedinasan',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 6001,
                category: 'question_type',
                name: 'Pilihan Ganda',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 6002,
                category: 'question_type',
                name: 'Essay',
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
