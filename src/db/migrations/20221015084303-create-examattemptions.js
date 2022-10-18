'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('exam_attemptions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
  
      exam_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      started_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      finished_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      total_correct: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue:0,
      },

      total_incorrect: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue:0,
      },

      total_empty: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue:0,
      },

      score: {
        type: Sequelize.DOUBLE,
        allowNull: false,
        defaultValue:0,
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
    
      CREATE TRIGGER exam_attemptions_before_insert BEFORE INSERT ON exam_attemptions
      FOR EACH ROW BEGIN
        DECLARE total_question int DEFAULT 0;
        SET total_question = (
            SELECT COUNT(id) as count
            FROM exam_questions as e
            WHERE e.exam_id=new.exam_id
            );
        SET new.total_empty = total_question;
        END;
      `)
  });
    

  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ExamAttemptions');
  }
};