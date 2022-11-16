'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('provinces', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },

    }).then(() => {
      return queryInterface.sequelize.query(`
    
      INSERT INTO provinces (id, name,created_at, updated_at) VALUES
      (11,	'Aceh', NOW(), NOW()),
      (12,	'Sumatera Utara', NOW(), NOW()),
      (13,	'Sumatera Barat', NOW(), NOW()),
      (14,	'Riau', NOW(), NOW()),
      (15,	'Jambi', NOW(), NOW()),
      (16,	'Sumatera Selatan', NOW(), NOW()),
      (17,	'Bengkulu', NOW(), NOW()),
      (18,	'Lampung', NOW(), NOW()),
      (19,	'Kepulauan Bangka Belitung', NOW(), NOW()),
      (21,	'Kepulauan Riau', NOW(), NOW()),
      (31,	'DKI Jakarta', NOW(), NOW()),
      (32,	'Jawa Barat', NOW(), NOW()),
      (33,	'Jawa Tengah', NOW(), NOW()),
      (34,	'DI Yogyakarta', NOW(), NOW()),
      (35,	'Jawa Timur', NOW(), NOW()),
      (36,	'Banten', NOW(), NOW()),
      (51,	'Bali', NOW(), NOW()),
      (52,	'Nusa Tenggara Barat', NOW(), NOW()),
      (53,	'Nusa Tenggara Timur', NOW(), NOW()),
      (61,	'Kalimantan Barat', NOW(), NOW()),
      (62,	'Kalimantan Tengah', NOW(), NOW()),
      (63,	'Kalimantan Selatan', NOW(), NOW()),
      (64,	'Kalimantan Timur', NOW(), NOW()),
      (65,	'Kalimantan Utara', NOW(), NOW()),
      (71,	'Sulawesi Utara', NOW(), NOW()),
      (72,	'Sulawesi Tengah', NOW(), NOW()),
      (73,	'Sulawesi Selatan', NOW(), NOW()),
      (74,	'Sulawesi Tenggara', NOW(), NOW()),
      (75,	'Gorontalo', NOW(), NOW()),
      (76,	'Sulawesi Barat', NOW(), NOW()),
      (81,	'Maluku', NOW(), NOW()),
      (82,	'Maluku Utara', NOW(), NOW()),
      (91,	'Papua', NOW(), NOW()),
      (92,	'Papua Barat', NOW(), NOW());
      
      `)
  });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('provinces');
  }
};