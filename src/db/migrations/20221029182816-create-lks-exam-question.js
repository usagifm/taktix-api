'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lks_exam_questions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      lks_content_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      question: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image: {
        type: Sequelize.STRING
      },
      question_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      a: {
        type: Sequelize.STRING
      },
      b: {
        type: Sequelize.STRING
      },
      c: {
        type: Sequelize.STRING
      },
      d: {
        type: Sequelize.STRING
      },
      e: {
        type: Sequelize.STRING
      },
      answer: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
    },
    updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
    },
    }).then(() => {
      return queryInterface.sequelize.query(`
      CREATE TRIGGER lks_exam_questions_after_delete AFTER DELETE ON lks_exam_questions
      FOR EACH ROW BEGIN
       UPDATE lks_contents SET exam_question_total=exam_question_total-1 WHERE id=old.lks_content_id;
      END;
      `)
  })
  .then(() => {
      return queryInterface.sequelize.query(`
      CREATE TRIGGER lks_exam_questions_after_insert AFTER INSERT ON lks_exam_questions
      FOR EACH ROW BEGIN
        UPDATE lks_contents SET exam_question_total=exam_question_total+1 WHERE id=new.lks_content_id;
      END;
      `)
  });;
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('lks_exam_questions');
  }
};