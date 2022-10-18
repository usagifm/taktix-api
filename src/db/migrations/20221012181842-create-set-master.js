'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('set_masters', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      category: {
        allowNull: false,
        type: Sequelize.STRING
      },
      name: {
        allowNull: false,
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
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
    },
    }) .then(() => {
      console.log('generate the set masters')
      return queryInterface.sequelize.query(`

            INSERT INTO set_masters (id,category, name,created_at, updated_at)
            VALUES 
            (1001,'role', 'Siswa', NOW(), NOW()),
            (1002,'role', 'Tutor', NOW(), NOW()),
            (2001,'gender', 'Laki-Laki', NOW(), NOW()),
            (2002,'gender', 'Perempuan', NOW(), NOW()),
            (3001,'question_category', 'Matematika', NOW(), NOW()),
            (3002,'question_category', 'Bahasa Indonesia', NOW(), NOW()),
            (3003,'question_category', 'Biologi', NOW(), NOW()),
            (4001,'exam_category', 'UN', NOW(), NOW()),
            (4002,'exam_category', 'UTBK', NOW(), NOW()),
            (4003,'exam_category', 'UAS', NOW(), NOW()),
            (4004,'exam_category', 'UTS', NOW(), NOW()),
            (5001,'grade', 'Kelas 1', NOW(), NOW()),
            (5002,'grade', 'Kelas 2', NOW(), NOW()),
            (5003,'grade', 'Kelas 3', NOW(), NOW()),
            (5004,'grade', 'Kelas 4', NOW(), NOW()),
            (5005,'grade', 'Kelas 5', NOW(), NOW()),
            (5006,'grade', 'Kelas 6', NOW(), NOW()),
            (5007,'grade', 'Kelas 7', NOW(), NOW()),
            (5008,'grade', 'Kelas 8', NOW(), NOW()),
            (5009,'grade', 'Kelas 9', NOW(), NOW()),
            (50010,'grade', 'Kelas 10', NOW(), NOW()),
            (50011,'grade', 'Kelas 11', NOW(), NOW()),
            (50012,'grade', 'Kelas 12', NOW(), NOW()),
            (50013,'grade', 'Umum', NOW(), NOW()),
            (6001,'category', 'Matematika', NOW(), NOW()),
            (6002,'category', 'Biologi', NOW(), NOW()),
            (6003,'category', 'Bahasa Indonesia', NOW(), NOW())
            ;
            
          `)
  })
  .then(() => {

    
  }).catch(err =>{
    console.log(err)
  });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SetMasters');
  }
};