'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('exam_attemptions_answers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      
      attemption_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
  
      question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      answer: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      is_correct: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue:0,
      },

      is_corrected: {
        type: Sequelize.BOOLEAN,
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
      CREATE TRIGGER exam_attemptions_answer_after_insert AFTER INSERT ON exam_attemptions_answers
      FOR EACH ROW BEGIN
     
     IF(new.is_correct > 0) THEN
           UPDATE exam_attemptions as attempt 
             SET 
             attempt.total_correct=(attempt.total_correct+1),
             attempt.total_empty=(attempt.total_empty-1)
             WHERE
             attempt.id=new.attemption_id;
     ELSE
           UPDATE exam_attemptions as attempt 
             SET 
             attempt.total_incorrect=(attempt.total_incorrect+1),
             attempt.total_empty=(attempt.total_empty-1)
             WHERE
             attempt.id=new.attemption_id;
     END IF;
     
     UPDATE exam_attemptions as attempt 
       SET 
       attempt.score=((attempt.total_correct/(attempt.total_correct+attempt.total_incorrect+attempt.total_empty))*100)
         WHERE
         attempt.id=new.attemption_id;
     
     END
      `)
  }).then(() => {
    return queryInterface.sequelize.query(`
    CREATE TRIGGER exam_attemptions_answer_after_delete AFTER DELETE ON exam_attemptions_answers
    FOR EACH ROW BEGIN
   
   IF(old.is_correct > 0) THEN
         UPDATE exam_attemptions as attempt 
           SET 
           attempt.total_correct=(attempt.total_correct-1),
           attempt.total_empty=(attempt.total_empty+1)
           WHERE
           attempt.id=old.attemption_id;
   ELSE
         UPDATE exam_attemptions as attempt 
           SET 
           attempt.total_incorrect=(attempt.total_incorrect-1),
           attempt.total_empty=(attempt.total_empty+1)
           WHERE
           attempt.id=old.attemption_id;
   END IF;
   
   UPDATE exam_attemptions as attempt 
     SET 
           attempt.score=((attempt.total_correct/(attempt.total_correct+attempt.total_incorrect+attempt.total_empty))*100)
       WHERE
           attempt.id=old.attemption_id;
   
   END
    `)
}).then(() => {
  return queryInterface.sequelize.query(`

  CREATE TRIGGER exam_attemptions_answer_after_update AFTER UPDATE ON exam_attemptions_answers
  FOR EACH ROW BEGIN
 IF(new.is_correct!= old.is_correct) THEN
     IF(new.is_correct > 0) THEN
             UPDATE exam_attemptions as attempt 
             SET 
             attempt.total_correct=(attempt.total_correct+1),
             attempt.total_incorrect=(attempt.total_incorrect-1)
             WHERE
             attempt.id=new.attemption_id;
     ELSE
             UPDATE exam_attemptions as attempt 
             SET 
             attempt.total_correct=(attempt.total_correct-1),
             attempt.total_incorrect=(attempt.total_incorrect+1)
             WHERE
             attempt.id=new.attemption_id;
     END IF;
 END IF;
 
 UPDATE exam_attemptions as attempt 
   SET 
         attempt.score=((attempt.total_correct/(attempt.total_correct+attempt.total_incorrect+attempt.total_empty))*100)
     WHERE
         attempt.id=new.attemption_id;
 
 END
  `)
});;
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('exam_attemptions_answers');
  }
};