'use strict'

module.exports = {
    async up(queryInterface, Sequelize) {
        const Op = Sequelize.Op

        queryInterface.addColumn(
            'lks_contents', // table name
            'content_name', // new field name
            {
                type: Sequelize.STRING,
                allowNull: false,
                after: 'lks_content_type_id',
            }
        )

        // queryInterface.bulkDelete('set_masters', {
        //     [Op.or]: [{ id: 8002 }],
        // })

        queryInterface.bulkInsert('set_masters', [
            {
                id: 8002,
                category: 'lks_content_type',
                name: 'Video',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 8003,
                category: 'lks_content_type',
                name: 'Soal',
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
