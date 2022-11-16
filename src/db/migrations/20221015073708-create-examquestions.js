'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('exam_questions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },

      exam_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      question: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      image: {
        type: Sequelize.STRING,
      },

      question_type: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      a: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      b: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      c: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      d: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      e: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      answer: {
        type: Sequelize.STRING,
        allowNull: false,
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
      console.log('created exam_questions table')
      return queryInterface.sequelize.query(`
      CREATE TRIGGER exam_questions_after_delete AFTER DELETE ON exam_questions
      FOR EACH ROW BEGIN
       UPDATE exams SET total_question=total_question-1 WHERE id=old.exam_id;
      END;
      `)
  })
  .then(() => {
      return queryInterface.sequelize.query(`
      CREATE TRIGGER exam_questions_after_insert AFTER INSERT ON exam_questions
      FOR EACH ROW BEGIN
        UPDATE exams SET total_question=total_question+1 WHERE id=new.exam_id;
      END;
      `)
  });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('exam_questions');
  }
};